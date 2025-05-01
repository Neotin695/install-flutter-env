
# Flutter Development Environment Installer

This script automates the installation of essential tools needed to set up a Flutter development environment on a Windows machine. It checks if **Chocolatey** is installed, installs it if not, and then uses it to install **Visual Studio Code**, **Flutter SDK**, and **Android Studio**.

## Requirements

- **Windows OS**
- **Administrator privileges** (required to install Chocolatey and the tools)
- **Node.js** (required to run the script)

## How it Works

1. **Chocolatey Installation**:  
   The script checks if **Chocolatey** is installed. If not, it installs it using PowerShell.

2. **Tool Installation**:  
   Once Chocolatey is installed, the script installs the following tools:
   - **Visual Studio Code**: A powerful and lightweight code editor.
   - **Flutter SDK**: The Flutter framework for building cross-platform mobile apps.
   - **Android Studio**: The official IDE for Android development, including the necessary Android SDK.

3. **Flutter Environment Setup**:  
   After installing all tools, the script runs `flutter doctor` to ensure that the Flutter development environment is correctly set up.

## How to Use

### Step 1: Install the Package Globally

To install the **flutter-env-installer** package globally, run the following command:

```bash
npm install -g flutter-env-installer
```

### Step 2: Run the Installer Using `npx`

Once installed, run the installer using **npx**:

```bash
npx flutter-env-installer
```

The script will:
- Check if **Chocolatey** is installed and install it if necessary.
- Install **Visual Studio Code**, **Flutter SDK**, and **Android Studio** using Chocolatey.
- Run `flutter doctor` to ensure the Flutter environment is properly configured.

### Step 3: Wait for the Installation

The script will display messages showing the progress of each installation. It will notify you if any installation fails.

Once completed, you will see the message:

```bash
🎉 Flutter development environment is fully ready!
```

## Troubleshooting

- Ensure you are running the script with **Administrator** privileges, as some tools require elevated permissions to install.
- If **Chocolatey** installation fails, check your internet connection or manually install it from [Chocolatey's website](https://community.chocolatey.org/install).
- If **Flutter** does not install correctly, review the output from `flutter doctor` to diagnose any issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
