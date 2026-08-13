import { PermissionType } from "../enums/permission-type.enum";
import type { PermissionRequestResult } from "../types/permission-request";
import { observeStatus } from "./observe-status";

export interface ModalStyleOptions {
  modalBackgroundColor?: string;
  modalTextColor?: string;
  modalBorderRadius?: string;
  buttonAllowBackgroundColor?: string;
  buttonAllowTextColor?: string;
  buttonRejectBackgroundColor?: string;
  buttonRejectTextColor?: string;
  buttonBorderRadius?: string;
  overlayBackgroundColor?: string;
  overlayZIndex?: number | string;
}

const DEFAULT_STYLES: Required<ModalStyleOptions> = {
  modalBackgroundColor: "#2d2d2d",
  modalTextColor: "#ffffff",
  modalBorderRadius: "12px",
  buttonAllowBackgroundColor: "#007aff",
  buttonAllowTextColor: "#ffffff",
  buttonRejectBackgroundColor: "#4d4d4d",
  buttonRejectTextColor: "#ffffff",
  buttonBorderRadius: "8px",
  overlayBackgroundColor: "rgba(0, 0, 0, 0.7)",
  overlayZIndex: 2147483647,
};

function mergeStyles(styleOptions: ModalStyleOptions = {}): Required<ModalStyleOptions> {
  return { ...DEFAULT_STYLES, ...styleOptions };
}

function createOverlay(styles: Required<ModalStyleOptions>): HTMLDivElement {
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
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  });
  return overlay;
}

function createModalShell(
  styles: Required<ModalStyleOptions>,
  titleText: string,
  messageText: string
): { modal: HTMLDivElement; title: HTMLHeadingElement; message: HTMLParagraphElement } {
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: styles.modalBackgroundColor,
    color: styles.modalTextColor,
    borderRadius: styles.modalBorderRadius,
    padding: "24px",
    width: "90%",
    maxWidth: "340px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  });
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const title = document.createElement("h2");
  title.textContent = titleText;
  Object.assign(title.style, {
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 16px 0",
  });
  const titleId = `permission-modal-title-${Math.random().toString(36).slice(2, 9)}`;
  title.id = titleId;

  const message = document.createElement("p");
  message.textContent = messageText;
  Object.assign(message.style, {
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 28px 0",
  });
  const messageId = `permission-modal-message-${Math.random().toString(36).slice(2, 9)}`;
  message.id = messageId;

  modal.setAttribute("aria-labelledby", titleId);
  modal.setAttribute("aria-describedby", messageId);

  modal.appendChild(title);
  modal.appendChild(message);

  return { modal, title, message };
}

function styleButton(
  button: HTMLButtonElement,
  styles: Required<ModalStyleOptions>,
  variant: "allow" | "reject"
): void {
  Object.assign(button.style, {
    border: "none",
    borderRadius: styles.buttonBorderRadius,
    padding: "14px 0",
    width: "100%",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
    backgroundColor:
      variant === "allow"
        ? styles.buttonAllowBackgroundColor
        : styles.buttonRejectBackgroundColor,
    color:
      variant === "allow"
        ? styles.buttonAllowTextColor
        : styles.buttonRejectTextColor,
  });
}

/**
 * Shows a single-button informational modal (e.g. unsupported browser).
 * Always removes itself from the DOM when dismissed.
 */
export function showInfoModal(
  titleText: string,
  messageText: string,
  styleOptions: ModalStyleOptions = {},
  dismissLabel = "OK"
): Promise<void> {
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
      justifyContent: "center",
    });

    const okButton = document.createElement("button");
    styleButton(okButton, styles, "allow");
    okButton.textContent = dismissLabel;
    okButton.type = "button";

    let settled = false;

    // Escape key support — listener is always detached in cleanup()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cleanup();
        resolve();
      }
    };

    const cleanup = () => {
      if (settled) return;
      settled = true;
      document.removeEventListener("keydown", onKeyDown);
      if (overlay.isConnected) {
        overlay.remove();
      }
    };

    okButton.onclick = () => {
      cleanup();
      resolve();
    };

    document.addEventListener("keydown", onKeyDown);

    buttons.appendChild(okButton);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    okButton.focus();
  });
}

/**
 * Shows the permission request modal, then runs `requestFn` if the user continues.
 * Guarantees overlay cleanup on every path (reject, timeout, allow, request errors).
 * Dismissals and unexpected throws are classified via observed permission status.
 */
export function withPermissionModal(
  permissionName: PermissionType,
  requestFn: () => Promise<PermissionRequestResult>,
  styleOptions: ModalStyleOptions = {}
): Promise<PermissionRequestResult> {
  const asDismissed = async (): Promise<PermissionRequestResult> => {
    const status = await observeStatus(permissionName);
    return { granted: false, status, reason: "dismissed" };
  };

  const asError = async (error: unknown): Promise<PermissionRequestResult> => {
    const status = await observeStatus(permissionName);
    return { granted: false, status, reason: "error", error };
  };

  if (typeof document === "undefined" || !document.body) {
    return requestFn().catch((error) => asError(error));
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
      gap: "12px",
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
    let intervalId: ReturnType<typeof setInterval> | null = null;

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

    const settle = (result: PermissionRequestResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const dismiss = () => {
      if (settled) return;
      allowButton.disabled = true;
      rejectButton.disabled = true;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      void asDismissed().then(settle);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    intervalId = setInterval(() => {
      countdown--;
      rejectButton.textContent = `Reject (${countdown}s)`;
      if (countdown <= 0) {
        dismiss();
      }
    }, 1000);

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
        settle(await asError(error));
      }
    };

    rejectButton.onclick = () => {
      dismiss();
    };
  });
}
