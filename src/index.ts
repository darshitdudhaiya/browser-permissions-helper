import { PermissionType } from "./enums/permission-type.enum";
import { requestPermission as requestPermissionInternal } from "./utils/request-permission";
import { ModalStyleOptions } from "./utils/modal";

export { PermissionType } from "./enums/permission-type.enum";
export { checkPermission } from "./utils/check-permission";
export { getPermissionSupportInfo } from "./utils/get-permission-support-info";

export function requestPermission(
  permissionName: PermissionType,
  styleOptions: ModalStyleOptions = {}
): Promise<boolean> {
  return requestPermissionInternal(permissionName, styleOptions);
}
