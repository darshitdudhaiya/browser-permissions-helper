# Browser Permissions Helper

![browser-permission-helper-banner.png](browser-permission-helper.png)


A simple utility to manage and request browser permissions seamlessly. This package provides an easy-to-use API for handling permissions like notifications, geolocation, camera, microphone, and more.

## 🚀 Features

- ✅ Check the current permission status for various browser APIs.
- 🔄 Request permissions dynamically.
- 📢 Listen to permission status changes in real time.
- 🛡️ Clear handling for unsupported browsers and features.
- 🎯 Lightweight and easy to integrate.

## ✨ Preview

When you request a permission, a modern, customizable modal will appear to the user.

![Permission Request Modal Preview](https://drive.google.com/uc?export=view&id=1Nd89Gf3dZF1lUg4yqPcHAQitJQVlHnIL)

## 📦 Installation

```sh
npm install browser-permissions-helper
```

or

```sh
yarn add browser-permissions-helper
```

## 🛠 Usage

### Import the Module

```javascript
import {
  PermissionType,
  checkPermission,
  requestPermission,
  getPermissionSupportInfo,
  onPermissionChange,
  isPermissionFeatureSupported,
} from 'browser-permissions-helper';
```

### Check Permission Status

```javascript
const status = await checkPermission(PermissionType.Geolocation);
// "granted" | "denied" | "prompt" | "unsupported"
console.log(`Geolocation permission: ${status}`);
```

### Request Permission

```javascript
const result = await requestPermission(PermissionType.Notifications);
console.log(`Notification permission granted: ${result}`);
```

If the feature is not available in the current browser, an informational modal is shown with supported-browser guidance and the promise resolves to `false`.

### Listen for Permission Changes

```javascript
const unsubscribe = onPermissionChange(PermissionType.Camera, (status) => {
  console.log('Camera permission changed to:', status);
  // Update UI or disable features when status becomes "denied" / "unsupported"
});

// Later, when the listener is no longer needed:
unsubscribe();
```

### Get Browser Support Info for permission

```javascript
const info = getPermissionSupportInfo(PermissionType.Bluetooth);
console.log(info.supportedBrowsers); // ['Chrome', 'Edge']
console.log(info.notes); // 'Not supported in Firefox or Safari'
```

### Detect Feature Support

```javascript
if (!isPermissionFeatureSupported(PermissionType.Bluetooth)) {
  console.log('Bluetooth is not available in this browser.');
}
```


## 📜 Supported Permissions

- `geolocation`
- `clipboard-write`
- `notifications`
- `camera`
- `microphone`
- `camera-advanced`
- `speaker-selection`
- `bluetooth`
- `midi`
- `nfc`
- `screen-wake-lock`
- `persistent-storage`
- `push`
- `idle-detection`
- `storage-access`
- `display-capture`
- `window-management`

## 📖 API Reference

### `checkPermission(permissionType: PermissionType) => Promise<'granted' | 'denied' | 'prompt' | 'unsupported'>`
Checks the current status of a given permission **without** prompting the user.

| Return value | Meaning |
|--------------|---------|
| `granted` | Permission is currently granted |
| `denied` | Permission is currently denied |
| `prompt` | Browser will ask the user (or status cannot be queried without prompting) |
| `unsupported` | Browser/feature cannot handle this permission |

### `requestPermission(permissionType: PermissionType, styleOptions?: ModalStyleOptions) => Promise<boolean>`
Requests the specified permission from the user and returns `true` if granted, otherwise `false`.

This function displays a customizable modal to the user before the native browser permission prompt appears. The Reject button includes a 15‑second countdown; when it reaches zero, the request resolves to `false`. Modal elements are always removed from the DOM (success, reject, timeout, or error).

When the underlying feature is not supported, an informational modal is shown instead and the function returns `false`.

#### Styling the Modal

You can customize the appearance of the modal by passing a `styleOptions` object. All properties are optional.

```javascript
const styleOptions = {
  modalBackgroundColor: '#333',
  modalTextColor: '#fff',
  modalBorderRadius: '15px',
  buttonAllowBackgroundColor: '#007bff',
  buttonAllowTextColor: '#fff',
  buttonRejectBackgroundColor: '#6c757d',
  buttonRejectTextColor: '#fff',
  buttonBorderRadius: '8px',
};

const result = await requestPermission(PermissionType.Notifications, styleOptions);
console.log(`Notification permission granted: ${result}`);
```

The `ModalStyleOptions` interface has the following properties:

- `modalBackgroundColor?: string`
- `modalTextColor?: string`
- `modalBorderRadius?: string`
- `buttonAllowBackgroundColor?: string`
- `buttonAllowTextColor?: string`
- `buttonRejectBackgroundColor?: string`
- `buttonRejectTextColor?: string`
- `buttonBorderRadius?: string`
- `overlayBackgroundColor?: string`
- `overlayZIndex?: number | string`

### `onPermissionChange(permissionType: PermissionType, callback: (status) => void) => () => void`
Subscribes to real-time permission status changes via the native Permissions API (`PermissionStatus.onchange`).

- Invokes the callback with the **current** status as soon as the subscription is ready
- Returns an **unsubscribe** function
- Calls the callback with `"unsupported"` when the Permissions API or feature is unavailable

### `getPermissionSupportInfo(permissionType: PermissionType) => { supportedBrowsers: string[]; notes?: string; }`
Returns a list of browsers that support the given permission, with optional notes for caveats or limited support.

### `isPermissionFeatureSupported(permissionType: PermissionType) => boolean`
Returns whether the underlying browser API for this permission is present (does not check grant/deny status).

## 🛡️ Browser Compatibility
This package works in modern browsers that support the **Permissions API**.

| Browser  | Supported |
|----------|----------|
| Chrome   | ✅ Yes   |
| Firefox  | ✅ Yes   |
| Edge     | ✅ Yes   |
| Safari   | ✅ Partial (Some permissions may not be available) |

When a permission or the Permissions API is unavailable, the library returns `"unsupported"` (for checks/listeners) or shows guidance and returns `false` (for requests) instead of silently treating the case as `"denied"`.

> 💡 Use `getPermissionSupportInfo()` or `isPermissionFeatureSupported()` to programmatically check support for specific permissions.


## 🤝 Contributing
Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a PR.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📜 License
This project is licensed under the **MIT License**.

## 📬 Contact
For any queries or issues, please [open an issue](https://github.com/darshitdudhaiya/browser-permissions-helper/issues).

To report a Code of Conduct concern privately, email **darshitdudhaiya201@gmail.com** (see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)).

---

⭐ **If you find this package useful, consider giving it a star on GitHub!** ⭐
