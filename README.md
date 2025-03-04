# 🌟 Browser Permissions Helper

A simple utility to manage and request browser permissions seamlessly. This package provides an easy-to-use API for handling permissions like notifications, geolocation, camera, microphone, and more.

## 🚀 Features

- ✅ Check the current permission status for various browser APIs.
- 🔄 Request permissions dynamically.
- 📢 Handle permission changes efficiently.
- 🎯 Lightweight and easy to integrate.

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
import { checkPermission, requestPermission } from 'browser-permissions-helper';
```

### Check Permission Status

```javascript
const status = await checkPermission('geolocation');
console.log(`Geolocation permission: ${status}`);
```

### Request Permission

```javascript
const result = await requestPermission('notifications');
console.log(`Notification permission granted: ${result}`);
```

## 📜 Supported Permissions

- `geolocation`
- `notifications`
- `camera`
- `microphone`
- `clipboard-read`
- `clipboard-write`

## 📖 API Reference

### `checkPermission(permissionType: string) => Promise<'granted' | 'denied' | 'prompt'>`
Checks the current status of a given permission.

### `requestPermission(permissionType: string) => Promise<boolean>`
Requests the specified permission from the user and returns `true` if granted, otherwise `false`.

## 🛡️ Browser Compatibility
This package works in modern browsers that support the **Permissions API**.

| Browser  | Supported |
|----------|----------|
| Chrome   | ✅ Yes   |
| Firefox  | ✅ Yes   |
| Edge     | ✅ Yes   |
| Safari   | ✅ Partial (Some permissions may not be available) |

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a PR.

## 📜 License
This project is licensed under the **MIT License**.

## 📬 Contact
For any queries or issues, please [open an issue](https://github.com/darshitdudhaiya/browser-permissions-helper/issues).

---

⭐ **If you find this package useful, consider giving it a star on GitHub!** ⭐

