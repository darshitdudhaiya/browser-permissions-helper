enum PermissionType {
  Geolocation = "geolocation",
  ClipboardWrite = "clipboard-write",
  Notifications = "notifications",
  Camera = "camera",
  Microphone = "microphone",
  CameraAdvanced = "camera-advanced",
  SpeakerSelection = "speaker-selection",
  Bluetooth = "bluetooth",
  Midi = "midi",
  NFC = "nfc",
  ScreenWakeLock = "screen-wake-lock",
  PersistentStorage = "persistent-storage",
  Push = "push",
  IdleDetection = "idle-detection",
  StorageAccess = "storage-access",
  DisplayCapture = "display-capture",
  WindowManagement = "window-management",
}

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
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          permissionName === PermissionType.Camera
            ? { video: true }
            : { audio: true }
        );
        stream.getTracks().forEach((track) => track.stop());
        return "granted";
      } catch (error) {
        console.error(`Error accessing ${permissionName}:`, error);
        return "denied";
      }
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

export async function requestPermission(
  permissionName: PermissionType
): Promise<boolean> {
  switch (permissionName) {
    case PermissionType.Geolocation:
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      });

    case PermissionType.ClipboardWrite:
      try {
        const permission = await navigator.permissions.query({
          name: "clipboard-write" as PermissionName,
        });
        return permission.state === "granted";
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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: permissionName === PermissionType.CameraAdvanced
            ? { width: 1920, height: 1080, facingMode: "user" }
            : { video: true },
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }

    case PermissionType.Microphone:
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }

    case PermissionType.SpeakerSelection:
      if ("selectAudioOutput" in navigator.mediaDevices) {
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
          await navigator.wakeLock.request("screen");
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case PermissionType.PersistentStorage:
      if (navigator.storage && navigator.storage.persist) {
        return navigator.storage.persist();
      }
      return false;

    case PermissionType.Push:
      if ("Notification" in window && "serviceWorker" in navigator) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return false;

        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>",
          });
          return true;
        } catch {
          return false;
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
        await navigator.mediaDevices.getDisplayMedia({ video: true });
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
      console.warn(`Manual request required for ${permissionName}.`);
      return false;
  }
}
