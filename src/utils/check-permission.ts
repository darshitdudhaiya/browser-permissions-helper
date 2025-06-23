import { PermissionType } from "../enums/permission-type.enum";

export async function checkPermission(
  permissionName: PermissionType
): Promise<PermissionState> {
  if (!navigator.permissions) {
    console.warn("Permissions API is not supported in this browser.");
    return "denied";
  }

  try {
    if (
      permissionName === PermissionType.Camera ||
      permissionName === PermissionType.Microphone
    ) {
      const constraints =
        permissionName === PermissionType.Camera ? { video: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());
      return "granted";
    }

    const permission = await navigator.permissions.query({
      name: permissionName as PermissionName,
    });
    return permission.state;
  } catch (error) {
    console.error(`Error checking permission for ${permissionName}:`, error);
    return "denied";
  }
}
