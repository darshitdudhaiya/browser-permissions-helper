import { PermissionType } from "./enums/permission-type.enum";
import { requestPermission as requestPermissionInternal } from "./utils/request-permission";
import { ModalStyleOptions } from "./utils/modal";

export { PermissionType } from "./enums/permission-type.enum";
export { checkPermission } from "./utils/check-permission";
export { getPermissionSupportInfo } from "./utils/get-permission-support-info";
export { onPermissionChange } from "./utils/on-permission-change";
export { isPermissionFeatureSupported } from "./utils/feature-support";
export type { ModalStyleOptions } from "./utils/modal";
export type {
  PermissionCheckResult,
  PermissionChangeCallback,
} from "./types/permission-status";
export type { PermissionSupportInfo } from "./data/permission-support-map";

export function requestPermission(
  permissionName: PermissionType,
  styleOptions: ModalStyleOptions = {}
): Promise<boolean> {
  return requestPermissionInternal(permissionName, styleOptions);
}
