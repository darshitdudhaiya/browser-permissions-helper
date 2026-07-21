import { PermissionType } from "../enums/permission-type.enum";
import { getPermissionSupportInfo } from "./get-permission-support-info";
import { isPermissionFeatureSupported } from "./feature-support";
import {
  withPermissionModal,
  showInfoModal,
  ModalStyleOptions,
} from "./modal";

function unsupportedMessage(permissionName: PermissionType): {
  title: string;
  message: string;
} {
  const info = getPermissionSupportInfo(permissionName);
  const browsers =
    info.supportedBrowsers.length > 0
      ? info.supportedBrowsers.join(", ")
      : "a modern browser that supports this feature";

  const notes = info.notes ? ` ${info.notes}.` : "";

  return {
    title: "Permission not supported",
    message: `This browser does not support "${permissionName}". Try ${browsers}.${notes}`,
  };
}

async function performPermissionRequest(
  permissionName: PermissionType
): Promise<boolean> {
  switch (permissionName) {
    case PermissionType.Geolocation:
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { maximumAge: 0, timeout: 10000 }
        );
      });

    case PermissionType.ClipboardWrite:
      try {
        // Prefer Permissions API so we never write to the clipboard
        if (navigator.permissions?.query) {
          const permission = await navigator.permissions.query({
            name: "clipboard-write" as PermissionName,
          });
          return permission.state === "granted";
        }
        // Fallback: presence of clipboard API only — do not write dummy text
        return !!(navigator.clipboard && navigator.clipboard.writeText);
      } catch {
        return false;
      }

    case PermissionType.Notifications:
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        return permission === "granted";
      }
      return false;

    case PermissionType.Camera:
    case PermissionType.CameraAdvanced:
      try {
        if (!navigator.mediaDevices?.getUserMedia) return false;
        const stream = await navigator.mediaDevices.getUserMedia({
          video:
            permissionName === PermissionType.CameraAdvanced
              ? { width: 1920, height: 1080, facingMode: "user" }
              : true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }

    case PermissionType.Microphone:
      try {
        if (!navigator.mediaDevices?.getUserMedia) return false;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }

    case PermissionType.SpeakerSelection:
      if (
        navigator.mediaDevices &&
        "selectAudioOutput" in navigator.mediaDevices
      ) {
        try {
          await (navigator.mediaDevices as any).selectAudioOutput();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.Bluetooth:
      if ("bluetooth" in navigator) {
        try {
          await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: true,
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.Midi:
      if (navigator.requestMIDIAccess) {
        try {
          await navigator.requestMIDIAccess();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.NFC:
      if ("NDEFReader" in window) {
        try {
          const nfc = new (window as any).NDEFReader();
          await nfc.scan();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.ScreenWakeLock:
      if ("wakeLock" in navigator) {
        try {
          const sentinel = await navigator.wakeLock.request("screen");
          try {
            await sentinel.release();
          } catch {
            /* ignore release errors */
          }
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.PersistentStorage:
      if (navigator.storage?.persist) {
        try {
          return await navigator.storage.persist();
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.Push:
      if ("Notification" in window && "serviceWorker" in navigator) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return false;

        try {
          // Avoid awaiting serviceWorker.ready when no SW is registered —
          // that promise can hang indefinitely.
          const registration = await navigator.serviceWorker.getRegistration();
          if (!registration?.active) {
            return Notification.permission === "granted";
          }

          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>",
          });
          return true;
        } catch {
          // Notification permission may still be granted even if push
          // subscription fails (e.g. missing VAPID key configuration).
          return Notification.permission === "granted";
        }
      }
      return false;

    case PermissionType.IdleDetection:
      if ("IdleDetector" in window) {
        try {
          const permission = await (
            window as any
          ).IdleDetector.requestPermission();
          return permission === "granted";
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.StorageAccess:
      if ("requestStorageAccess" in document) {
        try {
          await (document as any).requestStorageAccess();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.DisplayCapture:
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) return false;
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }

    case PermissionType.WindowManagement:
      if ("getScreenDetails" in window) {
        try {
          await (window as any).getScreenDetails();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    default:
      console.warn(
        `[browser-permissions-helper] Manual request required for "${permissionName}".`
      );
      return false;
  }
}

/**
 * Requests the specified permission from the user.
 *
 * Shows a customizable pre-prompt modal, then the native browser prompt.
 * When the permission feature is unavailable, shows an informational modal
 * with supported-browser guidance and returns `false`.
 */
export async function requestPermission(
  permissionName: PermissionType,
  styleOptions: ModalStyleOptions = {}
): Promise<boolean> {
  if (!isPermissionFeatureSupported(permissionName)) {
    const { title, message } = unsupportedMessage(permissionName);
    console.warn(
      `[browser-permissions-helper] Cannot request "${permissionName}": feature not supported in this browser.`
    );
    await showInfoModal(title, message, styleOptions);
    return false;
  }

  return withPermissionModal(
    permissionName,
    () => performPermissionRequest(permissionName),
    styleOptions
  );
}
