import { PermissionType } from "../enums/permission-type.enum";
import { PermissionCheckResult } from "../types/permission-status";
import {
  isPermissionFeatureSupported,
  toPermissionsQueryName,
} from "./feature-support";

/**
 * Checks the current status of a given permission.
 *
 * Returns:
 * - `"granted"` | `"denied"` | `"prompt"` when the status can be determined
 * - `"unsupported"` when the browser/feature cannot handle this permission
 *
 * Note: This function does not trigger a permission prompt (unlike older
 * versions that called `getUserMedia` for camera/microphone checks).
 */
export async function checkPermission(
  permissionName: PermissionType
): Promise<PermissionCheckResult> {
  if (!isPermissionFeatureSupported(permissionName)) {
    console.warn(
      `[browser-permissions-helper] Feature for "${permissionName}" is not available in this browser.`
    );
    return "unsupported";
  }

  // Notifications can be checked without Permissions API
  if (
    permissionName === PermissionType.Notifications ||
    permissionName === PermissionType.Push
  ) {
    if (!("Notification" in window)) {
      return "unsupported";
    }
    const state = Notification.permission;
    if (state === "default") return "prompt";
    return state as PermissionState;
  }

  if (!navigator.permissions || typeof navigator.permissions.query !== "function") {
    console.warn(
      "[browser-permissions-helper] Permissions API is not supported in this browser. Returning \"unsupported\"."
    );
    return "unsupported";
  }

  const queryName = toPermissionsQueryName(permissionName);

  if (!queryName) {
    // Feature exists but cannot be queried without prompting the user.
    // "prompt" is the safest non-destructive status for consumers.
    return "prompt";
  }

  try {
    const permission = await navigator.permissions.query({
      name: queryName,
    });
    return permission.state;
  } catch (error) {
    // Query name may not be recognized (older browsers, Safari quirks).
    // Prefer "unsupported" only when the feature itself is missing;
    // otherwise report "prompt" so callers can still attempt a request.
    console.warn(
      `[browser-permissions-helper] Could not query permission status for "${permissionName}":`,
      error
    );

    if (!isPermissionFeatureSupported(permissionName)) {
      return "unsupported";
    }

    return "prompt";
  }
}
