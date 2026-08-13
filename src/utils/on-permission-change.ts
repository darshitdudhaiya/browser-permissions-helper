import { PermissionType } from "../enums/permission-type.enum";
import {
  PermissionChangeCallback,
  PermissionCheckResult,
} from "../types/permission-status";
import {
  isPermissionFeatureSupported,
  toPermissionsQueryName,
} from "./feature-support";

function mapNotificationPermission(
  permission: NotificationPermission
): PermissionCheckResult {
  if (permission === "default") return "prompt";
  return permission;
}

/**
 * Subscribes to permission status changes for a given permission type.
 *
 * Uses the native `PermissionStatus.onchange` event when available.
 * Returns an unsubscribe function. Safe to call multiple times.
 *
 * Notifications / push emit the current `Notification.permission` immediately
 * (mapped `"default"` → `"prompt"`). If `permissions.query` later succeeds,
 * that subscription takes over for live settings changes.
 *
 * When the feature is present but cannot be queried (missing Permissions API,
 * no query name, or `query` throws), this warns and stays silent instead of
 * emitting `"unsupported"` — that signal was wrong for Safari notifications
 * and some camera queries.
 *
 * @example
 * ```ts
 * const unsubscribe = onPermissionChange(PermissionType.Camera, (status) => {
 *   console.log("Camera permission changed to:", status);
 * });
 *
 * // Later:
 * unsubscribe();
 * ```
 */
export function onPermissionChange(
  permissionName: PermissionType,
  callback: PermissionChangeCallback
): () => void {
  let active = true;
  let permissionStatus: PermissionStatus | null = null;

  const safeCallback = (status: PermissionCheckResult) => {
    if (!active) return;
    try {
      callback(status);
    } catch (error) {
      console.error(
        "[browser-permissions-helper] Error in onPermissionChange callback:",
        error
      );
    }
  };

  const unsubscribe = () => {
    if (!active) return;
    active = false;
    if (permissionStatus) {
      permissionStatus.onchange = null;
      permissionStatus = null;
    }
  };

  if (!isPermissionFeatureSupported(permissionName)) {
    queueMicrotask(() => safeCallback("unsupported"));
    return unsubscribe;
  }

  const isNotificationFamily =
    permissionName === PermissionType.Notifications ||
    permissionName === PermissionType.Push;

  if (
    isNotificationFamily &&
    typeof window !== "undefined" &&
    "Notification" in window
  ) {
    const initial = mapNotificationPermission(Notification.permission);
    queueMicrotask(() => safeCallback(initial));
  }

  if (
    typeof navigator === "undefined" ||
    !navigator.permissions ||
    typeof navigator.permissions.query !== "function"
  ) {
    console.warn(
      "[browser-permissions-helper] Permissions API is not supported in this browser."
    );
    return unsubscribe;
  }

  const queryName = toPermissionsQueryName(permissionName);

  if (!queryName) {
    console.warn(
      `[browser-permissions-helper] Permission change events are not available for "${permissionName}".`
    );
    return unsubscribe;
  }

  navigator.permissions
    .query({ name: queryName })
    .then((status) => {
      if (!active) return;
      permissionStatus = status;

      safeCallback(status.state);

      status.onchange = () => {
        safeCallback(status.state);
      };
    })
    .catch((error) => {
      console.warn(
        `[browser-permissions-helper] Unable to subscribe to changes for "${permissionName}":`,
        error
      );
    });

  return unsubscribe;
}
