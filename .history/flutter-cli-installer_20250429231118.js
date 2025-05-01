#!/usr/bin/env node

const { execSync } = require("child_process");

function execCommand(command, desc) {
  try {
    console.log(`🔧 ${desc}...`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Failed: ${desc}`);
    process.exit(1);
  }
}

function checkIfInstalled(command, toolName) {
  try {
    execSync(command, { stdio: "ignore" });
    console.log(`✅ ${toolName} is already installed.`);
    return true;
  } catch {
    console.log(`⬇ ${toolName} is not installed.`);
    return false;
  }
}

function installChocoIfNeeded() {
  if (!checkIfInstalled("choco -v", "Chocolatey")) {
    console.log("⬇ Installing Chocolatey...");
    execCommand(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`,
      "Installing Chocolatey"
    );
  }
}

function installAll() {
  const tools = [
    { name: "git", desc: "Installing Git", checkCommand: "git --version" },
    { name: "vscode", desc: "Installing Visual Studio Code", checkCommand: "code -v" },
    { name: "flutter", desc: "Installing Flutter SDK", checkCommand: "flutter --version" },
    { name: "androidstudio", desc: "Installing Android Studio", checkCommand: "studio -v" }
  ];

  tools.forEach(tool => {
    // Only install if not installed already
    if (!checkIfInstalled(tool.checkCommand, tool.desc)) {
      execCommand(`choco install ${tool.name} -y`, tool.desc);
    }
  });
}

function configureVSCodeForFlutter() {
  console.log("🔧 Installing Flutter and Dart extensions for VS Code...");
  execCommand(
    "code --install-extension Dart-Code.flutter",
    "Installing Flutter extension for Visual Studio Code"
  );
  execCommand(
    "code --install-extension Dart-Code.dart-code",
    "Installing Dart extension for Visual Studio Code"
  );
}

function configureAndroidStudio() {
  console.log("🔧 Setting up Android Studio for Flutter...");
  execCommand("flutter doctor --android-licenses", "Accepting Android licenses");
}

function configureFlutterEnvironment() {
  console.log("🔧 Configuring Flutter environment...");
  try {
    execSync("flutter doctor", { stdio: "inherit" });
    console.log("✅ Flutter environment is ready!");
  } catch (error) {
    console.error("❌ Flutter environment configuration failed. Please check the error messages above.");
    process.exit(1);
  }
}

(function main() {
  installChocoIfNeeded();
  installAll();
  configureVSCodeForFlutter();
  configureAndroidStudio();
  configureFlutterEnvironment();
  console.log("🎉 Flutter development environment is fully ready!");
})();
