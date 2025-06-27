import { PermissionType } from "../enums/permission-type.enum";
import { PermissionSupportInfo, PermissionSupportMap } from "../data/permission-support-map";

const DEFAULT_SUPPORT_INFO: PermissionSupportInfo = {
  supportedBrowsers: [],
  notes: "No compatibility info available.",
} as const;

export function getPermissionSupportInfo(
  permission: PermissionType
): PermissionSupportInfo {
  return PermissionSupportMap[permission] ?? DEFAULT_SUPPORT_INFO;
}
