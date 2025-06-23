import { PermissionType } from "../enums/permission-type.enum";

export interface PermissionSupportInfo {
  supportedBrowsers: string[];
  notes?: string;
}

export const PermissionSupportMap: Record<
  PermissionType,
  PermissionSupportInfo
> = {
  [PermissionType.Geolocation]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"],
  },
  [PermissionType.ClipboardWrite]: {
    supportedBrowsers: ["Chrome", "Edge"],
    notes: "Limited support in Firefox and Safari",
  },
  [PermissionType.Notifications]: {
    supportedBrowsers: ["Chrome", "Firefox", "Edge", "Safari"],
  },
  [PermissionType.Camera]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"],
  },
  [PermissionType.Microphone]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"],
  },
  [PermissionType.Bluetooth]: {
    supportedBrowsers: ["Chrome", "Edge"],
    notes: "Not supported in Safari or Firefox",
  },
  [PermissionType.NFC]: {
    supportedBrowsers: ["Chrome (Android only)"],
    notes: "Only available on Android devices in Chrome",
  },
  [PermissionType.IdleDetection]: {
    supportedBrowsers: ["Chrome"],
    notes: "Not supported in Safari or Firefox",
  },
  [PermissionType.WindowManagement]: {
    supportedBrowsers: ["Chrome"],
    notes: "Behind flags or not available in other browsers",
  },
  [PermissionType.DisplayCapture]: {
    supportedBrowsers: ["Chrome", "Firefox", "Edge"],
  },
  [PermissionType.ScreenWakeLock]: {
    supportedBrowsers: ["Chrome", "Edge"],
  },
  [PermissionType.Midi]: {
    supportedBrowsers: ["Chrome", "Edge"],
    notes: "Limited support in other browsers",
  },
  [PermissionType.SpeakerSelection]: {
    supportedBrowsers: ["Chrome"],
    notes: "Experimental support only",
  },
  [PermissionType.Push]: {
    supportedBrowsers: ["Chrome", "Firefox"],
    notes: "Safari does not support Push API via Service Workers",
  },
  [PermissionType.StorageAccess]: {
    supportedBrowsers: ["Safari"],
    notes: "Safari-only feature for cross-domain cookies",
  },
  [PermissionType.PersistentStorage]: {
    supportedBrowsers: ["Chrome", "Edge"],
  },
  [PermissionType.CameraAdvanced]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari"],
  },
};
