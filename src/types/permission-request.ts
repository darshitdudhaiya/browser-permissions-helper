import type { ModalStyleOptions } from "../utils/modal";
import type { PermissionCheckResult } from "./permission-status";

export type PermissionUiMode = "modal" | "none";

export type PermissionRequestReason =
  | "granted"
  | "denied"
  | "dismissed"
  | "unsupported"
  | "error"
  | "not-requested";

export interface PermissionRequestOptions extends ModalStyleOptions {
  /**
   * Pre-prompt UI.
   * Default: `"modal"` (v4.4 behavior). Pass `"none"` for native prompt only.
   */
  ui?: PermissionUiMode;
  /**
   * Preferred place for modal styles. Merged over top-level ModalStyleOptions
   * keys so both the 4.4 positional style object and the `{ ui, styleOptions }`
   * shape work.
   */
  styleOptions?: ModalStyleOptions;
}

export interface PermissionRequestResult {
  granted: boolean;
  /** Always the observed Permissions / Notification state after the event. Never inferred. */
  status: PermissionCheckResult;
  reason: PermissionRequestReason;
  error?: unknown;
}
