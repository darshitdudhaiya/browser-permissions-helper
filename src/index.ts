export { PermissionType } from "./enums/permission-type.enum";
export { checkPermission } from "./utils/check-permission";
export { getPermissionSupportInfo } from "./utils/get-permission-support-info";
export { onPermissionChange } from "./utils/on-permission-change";
export { isPermissionFeatureSupported } from "./utils/feature-support";
export {
  requestPermission,
  requestPermissionDetailed,
} from "./utils/request-permission";
export type { ModalStyleOptions } from "./utils/modal";
export type {
  PermissionCheckResult,
  PermissionChangeCallback,
} from "./types/permission-status";
export type { PermissionSupportInfo } from "./data/permission-support-map";
export type {
  PermissionRequestOptions,
  PermissionRequestResult,
  PermissionRequestReason,
  PermissionUiMode,
} from "./types/permission-request";
