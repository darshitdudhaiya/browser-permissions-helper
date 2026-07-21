import { PermissionType } from "../enums/permission-type.enum";

/**
 * Returns true when the underlying browser API required for this
 * permission is present. Does not check grant/deny status.
 */
export function isPermissionFeatureSupported(
  permissionName: PermissionType
): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }

  switch (permissionName) {
    case PermissionType.Geolocation:
      return "geolocation" in navigator;

    case PermissionType.ClipboardWrite:
      return !!(navigator.clipboard && navigator.clipboard.writeText);

    case PermissionType.Notifications:
    case PermissionType.Push:
      return "Notification" in window;

    case PermissionType.Camera:
    case PermissionType.CameraAdvanced:
    case PermissionType.Microphone:
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    case PermissionType.DisplayCapture:
      return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);

    case PermissionType.SpeakerSelection:
      return !!(
        navigator.mediaDevices &&
        "selectAudioOutput" in navigator.mediaDevices
      );

    case PermissionType.Bluetooth:
      return "bluetooth" in navigator;

    case PermissionType.Midi:
      return typeof navigator.requestMIDIAccess === "function";

    case PermissionType.NFC:
      return "NDEFReader" in window;

    case PermissionType.ScreenWakeLock:
      return "wakeLock" in navigator;

    case PermissionType.PersistentStorage:
      return !!(navigator.storage && navigator.storage.persist);

    case PermissionType.IdleDetection:
      return "IdleDetector" in window;

    case PermissionType.StorageAccess:
      return "requestStorageAccess" in document;

    case PermissionType.WindowManagement:
      return "getScreenDetails" in window;

    default:
      return false;
  }
}

/**
 * Maps library permission types to names accepted by
 * `navigator.permissions.query`. Returns null when the Permissions API
 * does not expose a reliable query name for this permission.
 */
export function toPermissionsQueryName(
  permissionName: PermissionType
): PermissionName | null {
  switch (permissionName) {
    case PermissionType.Geolocation:
      return "geolocation";
    case PermissionType.Notifications:
      return "notifications";
    case PermissionType.Push:
      return "push" as PermissionName;
    case PermissionType.Midi:
      return "midi" as PermissionName;
    case PermissionType.Camera:
    case PermissionType.CameraAdvanced:
      return "camera" as PermissionName;
    case PermissionType.Microphone:
      return "microphone" as PermissionName;
    case PermissionType.ClipboardWrite:
      return "clipboard-write" as PermissionName;
    case PermissionType.PersistentStorage:
      return "persistent-storage" as PermissionName;
    case PermissionType.ScreenWakeLock:
      return "screen-wake-lock" as PermissionName;
    case PermissionType.DisplayCapture:
      return "display-capture" as PermissionName;
    case PermissionType.IdleDetection:
      return "idle-detection" as PermissionName;
    case PermissionType.StorageAccess:
      return "storage-access" as PermissionName;
    case PermissionType.WindowManagement:
      return "window-management" as PermissionName;
    // No stable Permissions API name for these:
    case PermissionType.Bluetooth:
    case PermissionType.NFC:
    case PermissionType.SpeakerSelection:
    default:
      return null;
  }
}
