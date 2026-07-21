/**
 * Native PermissionState values plus a library-specific status
 * used when the browser or feature cannot support the permission.
 */
export type PermissionCheckResult = PermissionState | "unsupported";

export type PermissionChangeCallback = (status: PermissionCheckResult) => void;
