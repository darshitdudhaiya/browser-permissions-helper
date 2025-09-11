
export interface ModalStyleOptions {
  modalBackgroundColor?: string;
  modalTextColor?: string;
  modalBorderRadius?: string;
  buttonAllowBackgroundColor?: string;
  buttonAllowTextColor?: string;
  buttonRejectBackgroundColor?: string;
  buttonRejectTextColor?: string;
  buttonBorderRadius?: string;
}

export function withPermissionModal(
  permissionName: string,
  requestFn: () => Promise<boolean>,
  styleOptions: ModalStyleOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    const defaultStyles: ModalStyleOptions = {
      modalBackgroundColor: "#2d2d2d",
      modalTextColor: "#ffffff",
      modalBorderRadius: "12px",
      buttonAllowBackgroundColor: "#007aff",
      buttonAllowTextColor: "#ffffff",
      buttonRejectBackgroundColor: "#4d4d4d",
      buttonRejectTextColor: "#ffffff",
      buttonBorderRadius: "8px",
    };

    const styles = { ...defaultStyles, ...styleOptions };

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
      fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
    });

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

    const title = document.createElement("h2");
    title.textContent = `Permission for ${permissionName}`;
    Object.assign(title.style, {
        fontSize: "22px",
        fontWeight: "600",
        margin: "0 0 16px 0",
    });

    const message = document.createElement("p");
    message.textContent = `To provide full functionality, this site requires permission for ${permissionName}. Your data will be handled respectfully.`;
    Object.assign(message.style, {
        fontSize: "16px",
        lineHeight: "1.6",
        margin: "0 0 28px 0",
    });

    const buttons = document.createElement("div");
    Object.assign(buttons.style, {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
    });

    const rejectButton = document.createElement("button");
    const allowButton = document.createElement("button");

    Object.assign(rejectButton.style, {
        border: "none",
        borderRadius: styles.buttonBorderRadius,
        padding: "14px 0",
        width: "100%",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s, transform 0.1s",
        backgroundColor: styles.buttonRejectBackgroundColor,
        color: styles.buttonRejectTextColor,
    });

    Object.assign(allowButton.style, {
        border: "none",
        borderRadius: styles.buttonBorderRadius,
        padding: "14px 0",
        width: "100%",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s, transform 0.1s",
        backgroundColor: styles.buttonAllowBackgroundColor,
        color: styles.buttonAllowTextColor,
    });

    allowButton.textContent = "Continue";

    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(buttons);
    buttons.appendChild(rejectButton);
    buttons.appendChild(allowButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    let countdown = 15;
    rejectButton.textContent = `Reject (${countdown}s)`;

    const interval = setInterval(() => {
      countdown--;
      rejectButton.textContent = `Reject (${countdown}s)`;
      if (countdown <= 0) {
        clearInterval(interval);
        cleanup();
        resolve(false);
      }
    }, 1000);

    const cleanup = () => {
      clearInterval(interval);
      document.body.removeChild(overlay);
    };

    allowButton.onclick = async () => {
      cleanup();
      const result = await requestFn();
      resolve(result);
    };

    rejectButton.onclick = () => {
      cleanup();
      resolve(false);
    };
  });
}
