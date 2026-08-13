import { PermissionType } from "../enums/permission-type.enum";
import { PermissionCheckResult } from "../types/permission-status";
import { checkPermission } from "./check-permission";

/**
 * Reads the current permission state after a request event.
 *
 * Leaf module: imported by `modal.ts` and `request-permission.ts` so those
 * two files never import each other for this helper.
 * Not re-exported from `src/index.ts`.
 */
export async function observeStatus(
  permissionName: PermissionType
): Promise<PermissionCheckResult> {
  try {
    return await checkPermission(permissionName);
  } catch {
    return "prompt";
  }
}
