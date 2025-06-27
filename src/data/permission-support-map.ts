import { PermissionType } from "../enums/permission-type.enum";

export interface PermissionSupportInfo {
  supportedBrowsers: string[];
  notes?: string;
}

export const PermissionSupportMap: Record<
  PermissionType,
  Readonly<PermissionSupportInfo>
> = {
  [PermissionType.Geolocation]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"] as const,
  },
  [PermissionType.ClipboardWrite]: {
    supportedBrowsers: ["Chrome", "Edge"] as const,
    notes: "Limited support in Firefox and Safari",
  },
  [PermissionType.Notifications]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"] as const,
  },
  [PermissionType.Camera]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"] as const,
  },
  [PermissionType.Microphone]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"] as const,
  },
  [PermissionType.Bluetooth]: {
    supportedBrowsers: ["Chrome", "Edge"] as const,
    notes: "Not supported in Safari or Firefox",
  },
  [PermissionType.NFC]: {
    supportedBrowsers: ["Chrome (Android only)"] as const,
    notes: "Only available on Android devices in Chrome",
  },
  [PermissionType.IdleDetection]: {
    supportedBrowsers: ["Chrome"] as const,
    notes: "Not supported in Safari or Firefox",
  },
  [PermissionType.WindowManagement]: {
    supportedBrowsers: ["Chrome"] as const,
    notes: "Behind flags or not available in other browsers",
  },
  [PermissionType.DisplayCapture]: {
    supportedBrowsers: ["Chrome", "Firefox", "Edge"] as const,
  },
  [PermissionType.ScreenWakeLock]: {
    supportedBrowsers: ["Chrome", "Edge"] as const,
  },
  [PermissionType.Midi]: {
    supportedBrowsers: ["Chrome", "Edge"] as const,
    notes: "Limited support in other browsers",
  },
  [PermissionType.SpeakerSelection]: {
    supportedBrowsers: ["Chrome"] as const,
    notes: "Experimental support only",
  },
  [PermissionType.Push]: {
    supportedBrowsers: ["Chrome", "Firefox"] as const,
    notes: "Safari does not support Push API via Service Workers",
  },
  [PermissionType.StorageAccess]: {
    supportedBrowsers: ["Safari"] as const,
    notes: "Safari-only feature for cross-domain cookies",
  },
  [PermissionType.PersistentStorage]: {
    supportedBrowsers: ["Chrome", "Edge"] as const,
  },
  [PermissionType.CameraAdvanced]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari"] as const,
  },
};
