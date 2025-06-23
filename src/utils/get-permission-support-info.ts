import { PermissionType } from "../enums/permission-type.enum";
import { PermissionSupportMap } from "../data/permission-support-map";

export function getPermissionSupportInfo(permission: PermissionType) {
  return (
    PermissionSupportMap[permission] ?? {
      supportedBrowsers: [],
      notes: "No compatibility info available.",
    }
  );
}
