// src/enums/permission-type.enum.ts
var PermissionType = /* @__PURE__ */ ((PermissionType2) => {
  PermissionType2["Geolocation"] = "geolocation";
  PermissionType2["ClipboardWrite"] = "clipboard-write";
  PermissionType2["Notifications"] = "notifications";
  PermissionType2["Camera"] = "camera";
  PermissionType2["Microphone"] = "microphone";
  PermissionType2["CameraAdvanced"] = "camera-advanced";
  PermissionType2["SpeakerSelection"] = "speaker-selection";
  PermissionType2["Bluetooth"] = "bluetooth";
  PermissionType2["Midi"] = "midi";
  PermissionType2["NFC"] = "nfc";
  PermissionType2["ScreenWakeLock"] = "screen-wake-lock";
  PermissionType2["PersistentStorage"] = "persistent-storage";
  PermissionType2["Push"] = "push";
  PermissionType2["IdleDetection"] = "idle-detection";
  PermissionType2["StorageAccess"] = "storage-access";
  PermissionType2["DisplayCapture"] = "display-capture";
  PermissionType2["WindowManagement"] = "window-management";
  return PermissionType2;
})(PermissionType || {});

// src/data/permission-support-map.ts
var PermissionSupportMap = {
  ["geolocation" /* Geolocation */]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"]
  },
  ["clipboard-write" /* ClipboardWrite */]: {
    supportedBrowsers: ["Chrome", "Edge"],
    notes: "Limited support in Firefox and Safari"
  },
  ["notifications" /* Notifications */]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"]
  },
  ["camera" /* Camera */]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"]
  },
  ["microphone" /* Microphone */]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge"]
  },
  ["bluetooth" /* Bluetooth */]: {
    supportedBrowsers: ["Chrome", "Edge"],
    notes: "Not supported in Safari or Firefox"
  },
  ["nfc" /* NFC */]: {
    supportedBrowsers: ["Chrome (Android only)"],
    notes: "Only available on Android devices in Chrome"
  },
  ["idle-detection" /* IdleDetection */]: {
    supportedBrowsers: ["Chrome"],
    notes: "Not supported in Safari or Firefox"
  },
  ["window-management" /* WindowManagement */]: {
    supportedBrowsers: ["Chrome"],
    notes: "Behind flags or not available in other browsers"
  },
  ["display-capture" /* DisplayCapture */]: {
    supportedBrowsers: ["Chrome", "Firefox", "Edge"]
  },
  ["screen-wake-lock" /* ScreenWakeLock */]: {
    supportedBrowsers: ["Chrome", "Edge"]
  },
  ["midi" /* Midi */]: {
    supportedBrowsers: ["Chrome", "Edge"],
    notes: "Limited support in other browsers"
  },
  ["speaker-selection" /* SpeakerSelection */]: {
    supportedBrowsers: ["Chrome"],
    notes: "Experimental support only"
  },
  ["push" /* Push */]: {
    supportedBrowsers: ["Chrome", "Firefox"],
    notes: "Safari does not support Push API via Service Workers"
  },
  ["storage-access" /* StorageAccess */]: {
    supportedBrowsers: ["Safari"],
    notes: "Safari-only feature for cross-domain cookies"
  },
  ["persistent-storage" /* PersistentStorage */]: {
    supportedBrowsers: ["Chrome", "Edge"]
  },
  ["camera-advanced" /* CameraAdvanced */]: {
    supportedBrowsers: ["Chrome", "Firefox", "Safari"]
  }
};

// src/utils/get-permission-support-info.ts
var DEFAULT_SUPPORT_INFO = {
  supportedBrowsers: [],
  notes: "No compatibility info available."
};
function getPermissionSupportInfo(permission) {
  return PermissionSupportMap[permission] ?? DEFAULT_SUPPORT_INFO;
}

// src/utils/feature-support.ts
function isPermissionFeatureSupported(permissionName) {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }
  switch (permissionName) {
    case "geolocation" /* Geolocation */:
      return "geolocation" in navigator;
    case "clipboard-write" /* ClipboardWrite */:
      return !!(navigator.clipboard && navigator.clipboard.writeText);
    case "notifications" /* Notifications */:
    case "push" /* Push */:
      return "Notification" in window;
    case "camera" /* Camera */:
    case "camera-advanced" /* CameraAdvanced */:
    case "microphone" /* Microphone */:
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    case "display-capture" /* DisplayCapture */:
      return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
    case "speaker-selection" /* SpeakerSelection */:
      return !!(navigator.mediaDevices && "selectAudioOutput" in navigator.mediaDevices);
    case "bluetooth" /* Bluetooth */:
      return "bluetooth" in navigator;
    case "midi" /* Midi */:
      return typeof navigator.requestMIDIAccess === "function";
    case "nfc" /* NFC */:
      return "NDEFReader" in window;
    case "screen-wake-lock" /* ScreenWakeLock */:
      return "wakeLock" in navigator;
    case "persistent-storage" /* PersistentStorage */:
      return !!(navigator.storage && navigator.storage.persist);
    case "idle-detection" /* IdleDetection */:
      return "IdleDetector" in window;
    case "storage-access" /* StorageAccess */:
      return "requestStorageAccess" in document;
    case "window-management" /* WindowManagement */:
      return "getScreenDetails" in window;
    default:
      return false;
  }
}
function toPermissionsQueryName(permissionName) {
  switch (permissionName) {
    case "geolocation" /* Geolocation */:
      return "geolocation";
    case "notifications" /* Notifications */:
      return "notifications";
    case "push" /* Push */:
      return "push";
    case "midi" /* Midi */:
      return "midi";
    case "camera" /* Camera */:
    case "camera-advanced" /* CameraAdvanced */:
      return "camera";
    case "microphone" /* Microphone */:
      return "microphone";
    case "clipboard-write" /* ClipboardWrite */:
      return "clipboard-write";
    case "persistent-storage" /* PersistentStorage */:
      return "persistent-storage";
    case "screen-wake-lock" /* ScreenWakeLock */:
      return "screen-wake-lock";
    case "display-capture" /* DisplayCapture */:
      return "display-capture";
    case "idle-detection" /* IdleDetection */:
      return "idle-detection";
    case "storage-access" /* StorageAccess */:
      return "storage-access";
    case "window-management" /* WindowManagement */:
      return "window-management";
    // No stable Permissions API name for these:
    case "bluetooth" /* Bluetooth */:
    case "nfc" /* NFC */:
    case "speaker-selection" /* SpeakerSelection */:
    default:
      return null;
  }
}

// src/utils/modal.ts
var DEFAULT_STYLES = {
  modalBackgroundColor: "#2d2d2d",
  modalTextColor: "#ffffff",
  modalBorderRadius: "12px",
  buttonAllowBackgroundColor: "#007aff",
  buttonAllowTextColor: "#ffffff",
  buttonRejectBackgroundColor: "#4d4d4d",
  buttonRejectTextColor: "#ffffff",
  buttonBorderRadius: "8px",
  overlayBackgroundColor: "rgba(0, 0, 0, 0.7)",
  overlayZIndex: 2147483647
};
function mergeStyles(styleOptions = {}) {
  return { ...DEFAULT_STYLES, ...styleOptions };
}
function createOverlay(styles) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: styles.overlayBackgroundColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: String(styles.overlayZIndex),
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  });
  return overlay;
}
function createModalShell(styles, titleText, messageText) {
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: styles.modalBackgroundColor,
    color: styles.modalTextColor,
    borderRadius: styles.modalBorderRadius,
    padding: "24px",
    width: "90%",
    maxWidth: "340px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    textAlign: "center"
  });
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const title = document.createElement("h2");
  title.textContent = titleText;
  Object.assign(title.style, {
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 16px 0"
  });
  const titleId = `permission-modal-title-${Math.random().toString(36).slice(2, 9)}`;
  title.id = titleId;
  const message = document.createElement("p");
  message.textContent = messageText;
  Object.assign(message.style, {
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 28px 0"
  });
  const messageId = `permission-modal-message-${Math.random().toString(36).slice(2, 9)}`;
  message.id = messageId;
  modal.setAttribute("aria-labelledby", titleId);
  modal.setAttribute("aria-describedby", messageId);
  modal.appendChild(title);
  modal.appendChild(message);
  return { modal, title, message };
}
function styleButton(button, styles, variant) {
  Object.assign(button.style, {
    border: "none",
    borderRadius: styles.buttonBorderRadius,
    padding: "14px 0",
    width: "100%",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
    backgroundColor: variant === "allow" ? styles.buttonAllowBackgroundColor : styles.buttonRejectBackgroundColor,
    color: variant === "allow" ? styles.buttonAllowTextColor : styles.buttonRejectTextColor
  });
}
function showInfoModal(titleText, messageText, styleOptions = {}, dismissLabel = "OK") {
  if (typeof document === "undefined" || !document.body) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const styles = mergeStyles(styleOptions);
    const overlay = createOverlay(styles);
    const { modal } = createModalShell(styles, titleText, messageText);
    const buttons = document.createElement("div");
    Object.assign(buttons.style, {
      display: "flex",
      justifyContent: "center"
    });
    const okButton = document.createElement("button");
    styleButton(okButton, styles, "allow");
    okButton.textContent = dismissLabel;
    okButton.type = "button";
    let settled = false;
    const cleanup = () => {
      if (settled) return;
      settled = true;
      if (overlay.isConnected) {
        overlay.remove();
      }
    };
    okButton.onclick = () => {
      cleanup();
      resolve();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        document.removeEventListener("keydown", onKeyDown);
        cleanup();
        resolve();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    buttons.appendChild(okButton);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    okButton.focus();
  });
}
function withPermissionModal(permissionName, requestFn, styleOptions = {}) {
  if (typeof document === "undefined" || !document.body) {
    return requestFn().catch(() => false);
  }
  return new Promise((resolve) => {
    const styles = mergeStyles(styleOptions);
    const overlay = createOverlay(styles);
    const { modal } = createModalShell(
      styles,
      `Permission for ${permissionName}`,
      `To provide full functionality, this site requires permission for ${permissionName}. Your data will be handled respectfully.`
    );
    const buttons = document.createElement("div");
    Object.assign(buttons.style, {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px"
    });
    const rejectButton = document.createElement("button");
    const allowButton = document.createElement("button");
    rejectButton.type = "button";
    allowButton.type = "button";
    styleButton(rejectButton, styles, "reject");
    styleButton(allowButton, styles, "allow");
    allowButton.textContent = "Continue";
    buttons.appendChild(rejectButton);
    buttons.appendChild(allowButton);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    allowButton.focus();
    let countdown = 15;
    rejectButton.textContent = `Reject (${countdown}s)`;
    let settled = false;
    let intervalId = null;
    const cleanup = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (overlay.isConnected) {
        overlay.remove();
      }
      document.removeEventListener("keydown", onKeyDown);
    };
    const settle = (value) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        settle(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    intervalId = setInterval(() => {
      countdown--;
      rejectButton.textContent = `Reject (${countdown}s)`;
      if (countdown <= 0) {
        settle(false);
      }
    }, 1e3);
    allowButton.onclick = async () => {
      if (settled) return;
      allowButton.disabled = true;
      rejectButton.disabled = true;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (overlay.isConnected) {
        overlay.remove();
      }
      document.removeEventListener("keydown", onKeyDown);
      try {
        const result = await requestFn();
        settle(result);
      } catch (error) {
        console.error(
          `[browser-permissions-helper] Error while requesting "${permissionName}":`,
          error
        );
        settle(false);
      }
    };
    rejectButton.onclick = () => {
      settle(false);
    };
  });
}

// src/utils/request-permission.ts
function unsupportedMessage(permissionName) {
  const info = getPermissionSupportInfo(permissionName);
  const browsers = info.supportedBrowsers.length > 0 ? info.supportedBrowsers.join(", ") : "a modern browser that supports this feature";
  const notes = info.notes ? ` ${info.notes}.` : "";
  return {
    title: "Permission not supported",
    message: `This browser does not support "${permissionName}". Try ${browsers}.${notes}`
  };
}
async function performPermissionRequest(permissionName) {
  switch (permissionName) {
    case "geolocation" /* Geolocation */:
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { maximumAge: 0, timeout: 1e4 }
        );
      });
    case "clipboard-write" /* ClipboardWrite */:
      try {
        if (navigator.permissions?.query) {
          const permission = await navigator.permissions.query({
            name: "clipboard-write"
          });
          return permission.state === "granted";
        }
        return !!(navigator.clipboard && navigator.clipboard.writeText);
      } catch {
        return false;
      }
    case "notifications" /* Notifications */:
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        return permission === "granted";
      }
      return false;
    case "camera" /* Camera */:
    case "camera-advanced" /* CameraAdvanced */:
      try {
        if (!navigator.mediaDevices?.getUserMedia) return false;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: permissionName === "camera-advanced" /* CameraAdvanced */ ? { width: 1920, height: 1080, facingMode: "user" } : true
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }
    case "microphone" /* Microphone */:
      try {
        if (!navigator.mediaDevices?.getUserMedia) return false;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }
    case "speaker-selection" /* SpeakerSelection */:
      if (navigator.mediaDevices && "selectAudioOutput" in navigator.mediaDevices) {
        try {
          await navigator.mediaDevices.selectAudioOutput();
          return true;
        } catch {
          return false;
        }
      }
      return false;
    case "bluetooth" /* Bluetooth */:
      if ("bluetooth" in navigator) {
        try {
          await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    case "midi" /* Midi */:
      if (navigator.requestMIDIAccess) {
        try {
          await navigator.requestMIDIAccess();
          return true;
        } catch {
          return false;
        }
      }
      return false;
    case "nfc" /* NFC */:
      if ("NDEFReader" in window) {
        try {
          const nfc = new window.NDEFReader();
          await nfc.scan();
          return true;
        } catch {
          return false;
        }
      }
      return false;
    case "screen-wake-lock" /* ScreenWakeLock */:
      if ("wakeLock" in navigator) {
        try {
          const sentinel = await navigator.wakeLock.request("screen");
          try {
            await sentinel.release();
          } catch {
          }
          return true;
        } catch {
          return false;
        }
      }
      return false;
    case "persistent-storage" /* PersistentStorage */:
      if (navigator.storage?.persist) {
        try {
          return await navigator.storage.persist();
        } catch {
          return false;
        }
      }
      return false;
    case "push" /* Push */:
      if ("Notification" in window && "serviceWorker" in navigator) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return false;
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>"
          });
          return true;
        } catch {
          return Notification.permission === "granted";
        }
      }
      return false;
    case "idle-detection" /* IdleDetection */:
      if ("IdleDetector" in window) {
        try {
          const permission = await window.IdleDetector.requestPermission();
          return permission === "granted";
        } catch {
          return false;
        }
      }
      return false;
    case "storage-access" /* StorageAccess */:
      if ("requestStorageAccess" in document) {
        try {
          await document.requestStorageAccess();
          return true;
        } catch {
          return false;
        }
      }
      return false;
    case "display-capture" /* DisplayCapture */:
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) return false;
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }
    case "window-management" /* WindowManagement */:
      if ("getScreenDetails" in window) {
        try {
          await window.getScreenDetails();
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
async function requestPermission(permissionName, styleOptions = {}) {
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

// src/utils/check-permission.ts
async function checkPermission(permissionName) {
  if (!isPermissionFeatureSupported(permissionName)) {
    console.warn(
      `[browser-permissions-helper] Feature for "${permissionName}" is not available in this browser.`
    );
    return "unsupported";
  }
  if (permissionName === "notifications" /* Notifications */ || permissionName === "push" /* Push */) {
    if (!("Notification" in window)) {
      return "unsupported";
    }
    const state = Notification.permission;
    if (state === "default") return "prompt";
    return state;
  }
  if (!navigator.permissions || typeof navigator.permissions.query !== "function") {
    console.warn(
      '[browser-permissions-helper] Permissions API is not supported in this browser. Returning "unsupported".'
    );
    return "unsupported";
  }
  const queryName = toPermissionsQueryName(permissionName);
  if (!queryName) {
    return "prompt";
  }
  try {
    const permission = await navigator.permissions.query({
      name: queryName
    });
    return permission.state;
  } catch (error) {
    console.warn(
      `[browser-permissions-helper] Could not query permission status for "${permissionName}":`,
      error
    );
    if (!isPermissionFeatureSupported(permissionName)) {
      return "unsupported";
    }
    return "prompt";
  }
}

// src/utils/on-permission-change.ts
function onPermissionChange(permissionName, callback) {
  let active = true;
  let permissionStatus = null;
  const safeCallback = (status) => {
    if (!active) return;
    try {
      callback(status);
    } catch (error) {
      console.error(
        "[browser-permissions-helper] Error in onPermissionChange callback:",
        error
      );
    }
  };
  const unsubscribe = () => {
    if (!active) return;
    active = false;
    if (permissionStatus) {
      permissionStatus.onchange = null;
      permissionStatus = null;
    }
  };
  if (!isPermissionFeatureSupported(permissionName)) {
    queueMicrotask(() => safeCallback("unsupported"));
    return unsubscribe;
  }
  if (typeof navigator === "undefined" || !navigator.permissions || typeof navigator.permissions.query !== "function") {
    queueMicrotask(() => safeCallback("unsupported"));
    return unsubscribe;
  }
  const queryName = toPermissionsQueryName(permissionName);
  if (!queryName) {
    console.warn(
      `[browser-permissions-helper] Permission change events are not available for "${permissionName}".`
    );
    return unsubscribe;
  }
  navigator.permissions.query({ name: queryName }).then((status) => {
    if (!active) return;
    permissionStatus = status;
    safeCallback(status.state);
    status.onchange = () => {
      safeCallback(status.state);
    };
  }).catch((error) => {
    console.warn(
      `[browser-permissions-helper] Unable to subscribe to changes for "${permissionName}":`,
      error
    );
    if (active) {
      safeCallback("unsupported");
    }
  });
  return unsubscribe;
}

// src/index.ts
function requestPermission2(permissionName, styleOptions = {}) {
  return requestPermission(permissionName, styleOptions);
}
export {
  PermissionType,
  checkPermission,
  getPermissionSupportInfo,
  isPermissionFeatureSupported,
  onPermissionChange,
  requestPermission2 as requestPermission
};
