import { PermissionType } from "../enums/permission-type.enum";
import type {
  PermissionRequestOptions,
  PermissionRequestResult,
} from "../types/permission-request";
import { getPermissionSupportInfo } from "./get-permission-support-info";
import { isPermissionFeatureSupported } from "./feature-support";
import {
  withPermissionModal,
  showInfoModal,
  ModalStyleOptions,
} from "./modal";
import { observeStatus } from "./observe-status";

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

function resolveStyleOptions(
  options: PermissionRequestOptions = {}
): ModalStyleOptions {
  const { ui: _ui, styleOptions, ...legacyStyle } = options;
  return { ...legacyStyle, ...styleOptions };
}

function unsupportedResult(): PermissionRequestResult {
  return { granted: false, status: "unsupported", reason: "unsupported" };
}

async function grantedResult(
  permissionName: PermissionType
): Promise<PermissionRequestResult> {
  const status = await observeStatus(permissionName);
  return { granted: true, status, reason: "granted" };
}

async function deniedResult(
  permissionName: PermissionType
): Promise<PermissionRequestResult> {
  const status = await observeStatus(permissionName);
  return { granted: false, status, reason: "denied" };
}

async function notRequestedResult(
  permissionName: PermissionType
): Promise<PermissionRequestResult> {
  const status = await observeStatus(permissionName);
  return { granted: false, status, reason: "not-requested" };
}

async function errorResult(
  permissionName: PermissionType,
  error: unknown
): Promise<PermissionRequestResult> {
  const status = await observeStatus(permissionName);
  return { granted: false, status, reason: "error", error };
}

function isNamedError(error: unknown, ...names: string[]): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as { name?: string }).name;
  return typeof name === "string" && names.includes(name);
}

function isUserAbortException(error: unknown): boolean {
  return isNamedError(error, "NotAllowedError", "PermissionDeniedError");
}

async function fromUserAbort(
  permissionName: PermissionType
): Promise<PermissionRequestResult> {
  const status = await observeStatus(permissionName);
  if (status === "denied") {
    return { granted: false, status, reason: "denied" };
  }
  return { granted: false, status, reason: "dismissed" };
}

async function fromException(
  permissionName: PermissionType,
  error: unknown
): Promise<PermissionRequestResult> {
  if (isUserAbortException(error)) {
    return fromUserAbort(permissionName);
  }
  return errorResult(permissionName, error);
}

async function fromNotificationPermission(
  permissionName: PermissionType,
  permission: NotificationPermission
): Promise<PermissionRequestResult> {
  if (permission === "granted") {
    return grantedResult(permissionName);
  }
  if (permission === "default") {
    const status = await observeStatus(permissionName);
    return { granted: false, status, reason: "dismissed" };
  }
  return fromUserAbort(permissionName);
}

async function requestMedia(
  permissionName: PermissionType,
  getStream: () => Promise<MediaStream>
): Promise<PermissionRequestResult> {
  try {
    const stream = await getStream();
    stream.getTracks().forEach((track) => track.stop());
    return grantedResult(permissionName);
  } catch (error) {
    return fromException(permissionName, error);
  }
}

async function performPermissionRequest(
  permissionName: PermissionType
): Promise<PermissionRequestResult> {
  switch (permissionName) {
    case PermissionType.Geolocation:
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(unsupportedResult());
          return;
        }
        navigator.geolocation.getCurrentPosition(
          () => {
            void grantedResult(permissionName).then(resolve);
          },
          (error) => {
            if (error.code === 1) {
              void fromUserAbort(permissionName).then(resolve);
              return;
            }
            void errorResult(permissionName, error).then(resolve);
          },
          { maximumAge: 0, timeout: 10000 }
        );
      });

    case PermissionType.ClipboardWrite:
      try {
        if (navigator.permissions?.query) {
          const permission = await navigator.permissions.query({
            name: "clipboard-write" as PermissionName,
          });
          if (permission.state === "granted") {
            return grantedResult(permissionName);
          }
          if (permission.state === "denied") {
            return fromUserAbort(permissionName);
          }
          return notRequestedResult(permissionName);
        }
        if (typeof navigator.clipboard?.writeText === "function") {
          return grantedResult(permissionName);
        }
        return unsupportedResult();
      } catch (error) {
        return fromException(permissionName, error);
      }

    case PermissionType.Notifications:
      if ("Notification" in window) {
        try {
          const permission = await Notification.requestPermission();
          return fromNotificationPermission(permissionName, permission);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.Camera:
    case PermissionType.CameraAdvanced:
      if (!navigator.mediaDevices?.getUserMedia) {
        return unsupportedResult();
      }
      return requestMedia(permissionName, () =>
        navigator.mediaDevices.getUserMedia({
          video:
            permissionName === PermissionType.CameraAdvanced
              ? { width: 1920, height: 1080, facingMode: "user" }
              : true,
        })
      );

    case PermissionType.Microphone:
      if (!navigator.mediaDevices?.getUserMedia) {
        return unsupportedResult();
      }
      return requestMedia(permissionName, () =>
        navigator.mediaDevices.getUserMedia({ audio: true })
      );

    case PermissionType.SpeakerSelection:
      if (
        navigator.mediaDevices &&
        "selectAudioOutput" in navigator.mediaDevices
      ) {
        try {
          await (navigator.mediaDevices as any).selectAudioOutput();
          return grantedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.Bluetooth:
      if ("bluetooth" in navigator) {
        try {
          await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: true,
          });
          return grantedResult(permissionName);
        } catch (error) {
          if (isUserAbortException(error)) {
            return fromUserAbort(permissionName);
          }
          if (isNamedError(error, "NotFoundError")) {
            const status = await observeStatus(permissionName);
            if (status === "denied") {
              return { granted: false, status, reason: "denied" };
            }
          }
          return errorResult(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.Midi:
      if (navigator.requestMIDIAccess) {
        try {
          await navigator.requestMIDIAccess();
          return grantedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.NFC:
      if ("NDEFReader" in window) {
        try {
          const nfc = new (window as any).NDEFReader();
          await nfc.scan();
          return grantedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.ScreenWakeLock:
      if ("wakeLock" in navigator) {
        try {
          const sentinel = await navigator.wakeLock.request("screen");
          try {
            await sentinel.release();
          } catch {
            /* ignore release errors */
          }
          return grantedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.PersistentStorage:
      if (navigator.storage?.persist) {
        try {
          const persisted = await navigator.storage.persist();
          if (persisted) {
            return grantedResult(permissionName);
          }
          return deniedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.Push:
      if ("Notification" in window && "serviceWorker" in navigator) {
        let permission: NotificationPermission;
        try {
          permission = await Notification.requestPermission();
        } catch (error) {
          return fromException(permissionName, error);
        }

        if (permission !== "granted") {
          return fromNotificationPermission(permissionName, permission);
        }

        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (!registration?.active) {
            return grantedResult(permissionName);
          }

          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>",
          });
          return grantedResult(permissionName);
        } catch (error) {
          if (Notification.permission === "granted") {
            const status = await observeStatus(permissionName);
            return { granted: true, status, reason: "granted", error };
          }
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.IdleDetection:
      if ("IdleDetector" in window) {
        try {
          const permission = await (
            window as any
          ).IdleDetector.requestPermission();
          if (permission === "granted") {
            return grantedResult(permissionName);
          }
          if (permission === "denied") {
            return fromUserAbort(permissionName);
          }
          return deniedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.StorageAccess:
      if ("requestStorageAccess" in document) {
        try {
          await (document as any).requestStorageAccess();
          return grantedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    case PermissionType.DisplayCapture:
      if (!navigator.mediaDevices?.getDisplayMedia) {
        return unsupportedResult();
      }
      return requestMedia(permissionName, () =>
        navigator.mediaDevices.getDisplayMedia({ video: true })
      );

    case PermissionType.WindowManagement:
      if ("getScreenDetails" in window) {
        try {
          await (window as any).getScreenDetails();
          return grantedResult(permissionName);
        } catch (error) {
          return fromException(permissionName, error);
        }
      }
      return unsupportedResult();

    default:
      console.warn(
        `[browser-permissions-helper] Manual request required for "${permissionName}".`
      );
      return unsupportedResult();
  }
}

/**
 * Requests the specified permission from the user.
 *
 * Default `ui` is `"modal"` (v4.4 behavior): a customizable pre-prompt, then
 * the native browser prompt. Pass `{ ui: "none" }` to skip the library modal.
 *
 * Returns `true` only when this request succeeded. For dismissed vs denied vs
 * unsupported vs error, use {@link requestPermissionDetailed}.
 */
export async function requestPermission(
  permissionName: PermissionType,
  options: PermissionRequestOptions = {}
): Promise<boolean> {
  const result = await requestPermissionDetailed(permissionName, options);
  return result.granted;
}

/**
 * Requests the specified permission and returns a structured result.
 *
 * `status` is always the observed Permissions / Notification state after the
 * event. `reason` is derived from the pair (event, observed status).
 */
export async function requestPermissionDetailed(
  permissionName: PermissionType,
  options: PermissionRequestOptions = {}
): Promise<PermissionRequestResult> {
  const ui = options.ui ?? "modal";
  const styleOptions = resolveStyleOptions(options);

  if (!isPermissionFeatureSupported(permissionName)) {
    console.warn(
      `[browser-permissions-helper] Cannot request "${permissionName}": feature not supported in this browser.`
    );
    if (ui === "modal") {
      const { title, message } = unsupportedMessage(permissionName);
      await showInfoModal(title, message, styleOptions);
    }
    return {
      granted: false,
      status: "unsupported",
      reason: "unsupported",
    };
  }

  const runNative = () => performPermissionRequest(permissionName);

  if (ui === "none") {
    return runNative();
  }

  return withPermissionModal(permissionName, runNative, styleOptions);
}
