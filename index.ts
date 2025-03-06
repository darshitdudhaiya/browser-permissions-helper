export async function checkPermission(
  permissionName: PermissionName
): Promise<PermissionState> {
  if (!navigator.permissions) {
    console.warn("Permissions API is not supported in this browser.");
    return "denied";
  }
  try {
    if (
      permissionName === ("camera" as PermissionName) ||
      permissionName === ("microphone" as PermissionName)
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          permissionName === ("camera" as PermissionName)
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
      name: permissionName,
    });
    return permission.state;
  } catch (error) {
    console.error(`Error checking permission for ${permissionName}:`, error);
    return "denied";
  }
}
export async function requestPermission(
  permissionName: PermissionName
): Promise<boolean> {
  switch (permissionName) {
    case "geolocation":
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      });

    case "clipboard-write" as PermissionName:
      try {
        const original = await navigator.clipboard.readText();
        await navigator.clipboard.writeText("test");
        await navigator.clipboard.writeText(original); // Restore User's clipboard data back 
        return true;
      } catch {
        return false;
      }

    case "notifications":
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        return permission === "granted";
      }
      return false;

    case "camera" as PermissionName:
      try {
        // Get the stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // Stop all tracks to release the camera
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          console.warn("Camera access was blocked. Enable it in settings.");
        } else {
          console.error("Camera error:", error.name, error.message);
        }
        return false;
      }

    case "microphone" as PermissionName:
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (error) {
        console.error("Microphone error:", error.name, error.message);
        return false;
      }

    case "camera-advanced" as PermissionName:
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1920, height: 1080, facingMode: "user" },
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (error) {
        console.error("Advanced camera error:", error.name, error.message);
        return false;
      }

    case "speaker-selection" as PermissionName:
      if ("selectAudioOutput" in navigator.mediaDevices) {
        try {
          await (navigator.mediaDevices as any).selectAudioOutput();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case "bluetooth" as PermissionName:
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

    case "midi" as PermissionName:
      if (navigator.requestMIDIAccess) {
        try {
          await navigator.requestMIDIAccess();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case "nfc" as PermissionName:
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

    case "screen-wake-lock":
      if ("wakeLock" in navigator) {
        try {
          await navigator.wakeLock.request("screen");
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case "persistent-storage":
      if (navigator.storage && navigator.storage.persist) {
        return navigator.storage.persist();
      }
      return false;

    case "push":
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

    case "idle-detection" as PermissionName:
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

    case "storage-access" as PermissionName:
      if ("requestStorageAccess" in document) {
        try {
          await (document as any).requestStorageAccess();
          return true;
        } catch {
          return false;
        }
      }
      return false;

    case "display-capture" as PermissionName:
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        return true;
      } catch {
        return false;
      }

    case "window-management" as PermissionName:
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
