# Contributing Guidelines


Thank you for considering contributing to **Browser Permission Helper**! Your contributions help improve the project and benefit the community. Before you start, please read the following guidelines to ensure a smooth collaboration.

## 💡 How to Contribute


### 🛠 Reporting Issues

If you encounter a bug or have a feature request, please:

1.  **Check existing issues** to see if it has already been reported.
2.  **Open a new issue** with a clear title and detailed description.
3.  Provide steps to reproduce the issue, along with screenshots if applicable.

### 📌 Feature Requests

We welcome feature suggestions! When proposing a new feature:

-   Clearly describe the problem and how the new feature solves it.
-   Explain any alternative solutions you've considered.
-   If possible, include relevant code snippets or examples.

### 🔥 Submitting a Pull Request

1.  **Fork the repository** and create a new branch (`feature/your-feature` or `fix/issue-name`).
2.  **Make your changes**, ensuring they follow the project's coding style.
3.  **Test your changes** to confirm everything works as expected.
4.  **Commit your code** with a clear message describing the changes.
5.  **Push your branch** and open a Pull Request (PR).

#### ✅ PR Requirements

-   Ensure your PR is linked to an issue (if applicable).
-   Keep the PR focused on a single change or feature.
-   Provide a meaningful description of the changes made.

### 📦 Releases (version bump on merge to `main`)

You do **not** need to edit `package.json` version by hand. Merging into `main` runs the publish workflow, which bumps the version, publishes to npm, tags git, and creates a GitHub Release.

Choose the bump type (default is **patch**):

| Method | How |
|--------|-----|
| **PR label** (recommended) | Add one of: `release:patch`, `release:minor`, `release:major` (aliases: `patch`, `minor`, `major`) |
| **Commit / merge message** | Include `[patch]`, `[minor]`, or `[major]` (also `release:minor`, `#minor`, etc.) |
| **Manual run** | Actions → **Publish NPM Package** → **Run workflow** → pick bump |

**Guidance**

- **patch** — bug fixes, small improvements (`4.3.6` → `4.3.7`)
- **minor** — new features, non-breaking API additions (`4.3.6` → `4.4.0`)
- **major** — breaking changes (`4.3.6` → `5.0.0`)

If several signals are present, priority is: workflow input → commit message → PR label → default `patch`.  
If multiple release labels exist on a PR, the highest impact wins (`major` > `minor` > `patch`).

### 🌟 Code Style & Best Practices

-   Follow clean and consistent coding standards.
-   Use meaningful variable and function names.
-   Keep commits small and descriptive.

### 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the repository.

💬 Need Help?
-------------

If you have any questions, feel free to open an issue or reach out via discussions.

Happy coding! 🚀
