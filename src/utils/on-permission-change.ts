import { PermissionType } from "../enums/permission-type.enum";
import {
  PermissionChangeCallback,
  PermissionCheckResult,
} from "../types/permission-status";
import {
  isPermissionFeatureSupported,
  toPermissionsQueryName,
} from "./feature-support";

/**
 * Subscribes to permission status changes for a given permission type.
 *
 * Uses the native `PermissionStatus.onchange` event when available.
 * Returns an unsubscribe function. Safe to call multiple times.
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
    // Notify once asynchronously so subscribers still learn the state
    queueMicrotask(() => safeCallback("unsupported"));
    return unsubscribe;
  }

  if (
    typeof navigator === "undefined" ||
    !navigator.permissions ||
    typeof navigator.permissions.query !== "function"
  ) {
    queueMicrotask(() => safeCallback("unsupported"));
    return unsubscribe;
  }

  const queryName = toPermissionsQueryName(permissionName);

  if (!queryName) {
    // Cannot subscribe without a queryable permission name
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

      // Emit current state immediately so consumers can sync UI
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
      if (active) {
        safeCallback("unsupported");
      }
    });

  return unsubscribe;
}
