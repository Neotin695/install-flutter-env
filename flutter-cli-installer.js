#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

function execCommand(command, desc, ignoreErrors = false) {
  try {
    console.log(`\n🔧 ${desc}...`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    if (ignoreErrors) {
      console.warn(`⚠️ Ignored failure: ${desc}`);
    } else {
      console.error(`❌ Failed: ${desc}`);
      process.exit(1);
    }
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
  const chocoFolder = "C:\\ProgramData\\chocolatey";

  if (!checkIfInstalled("choco -v", "Chocolatey")) {
    console.log("⚠️ Chocolatey not found or broken.");

    if (fs.existsSync(chocoFolder)) {
      console.log("🧹 Found existing Chocolatey folder. Deleting...");
      execCommand(`rmdir /s /q \"${chocoFolder}\"`, "Deleting old Chocolatey folder");
    }

    execCommand(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`,
      "Installing Chocolatey"
    );

    if (!checkIfInstalled("choco -v", "Chocolatey (post-install)")) {
      console.error("❌ Chocolatey installation still failed. Please check manually.");
      process.exit(1);
    }
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
    if (!checkIfInstalled(tool.checkCommand, tool.desc)) {
      execCommand(`choco install ${tool.name} -y`, tool.desc);
    }
  });
}

function ensureFlutterInPath() {
  console.log("🔧 Ensuring Flutter is in PATH...");
  const flutterBinPath = "C:\\tools\\flutter\\bin";
  const pathEnv = process.env.PATH.split(';');

  if (!pathEnv.includes(flutterBinPath)) {
    console.log("⬇ Adding Flutter to PATH...");

    execCommand(`setx PATH \"${process.env.PATH};${flutterBinPath}\"`, "Adding Flutter to User PATH");
    execCommand(`reg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment\" /v PATH /t REG_EXPAND_SZ /f /d \"%PATH%;${flutterBinPath}\"`, "Adding Flutter to System PATH");

    process.env.PATH += `;${flutterBinPath}`;
  } else {
    console.log("✅ Flutter is already in PATH.");
  }
}

function configureVSCodeForFlutter() {
  console.log("🔧 Installing Flutter-specific extensions for VS Code...");

  const extensions = [
    "aksharpatel47.vscode-flutter-helper",
    "circlecodesolution.ccs-flutter-color",
    "dart-code.dart-code",
    "dart-code.flutter",
    "felixangelov.bloc",
    "fullystackeddevelopment.flutter-clean-architecture-scaffold",
    "google.arb-editor",
    "hirantha.json-to-dart",
    "hzgood.dart-data-class-generator",
    "jeroen-meijer.pubspec-assist",
    "localizely.flutter-intl",
    "luanpotter.dart-import",
    "muhammadnorzariman.jsontodart",
    "oscarcs.dart-syntax-highlighting-only",
    "parthr2031.colorful-comments",
    "peterhdd.dartgettersetter",
    "weekit.flutter-assets-gen2",
    "zealousfoundry.flutter-extract-to-arb"
  ];

  extensions.forEach(extension => {
    execCommand(`code --install-extension ${extension}`, `Installing ${extension}`);
  });
}

async function configureAndroidStudio() {
  console.log("🔧 Opening Android Studio to trigger first-time setup...");

  execCommand("start /B \"\" \"C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe\"", "Launching Android Studio");

  const sdkPath = `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Android\\Sdk`;
  const cmdlinePath = `${sdkPath}\\cmdline-tools`;

  console.log("⏳ Waiting for Android Studio to install SDK tools...");

  const maxWaitTime = 300000;
  const checkInterval = 5000;

  const waitForCmdlineTools = async () => {
    const start = Date.now();
    while (!fs.existsSync(cmdlinePath)) {
      const elapsed = Date.now() - start;
      if (elapsed > maxWaitTime) {
        console.error("❌ Timed out waiting for Android SDK Command Line Tools. Please install them manually then rerun the script.");
        process.exit(1);
      }
      console.log(`⏳ Still waiting... (${Math.floor(elapsed / 1000)}s elapsed)`);
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    console.log("✅ Android SDK tools detected!");
  };

  await waitForCmdlineTools();

  execCommand("flutter doctor --android-licenses", "Accepting Android SDK licenses", true);
  execCommand("flutter doctor", "Running flutter doctor to check the environment");
}

function configureFlutterEnvironment() {
  console.log("🔧 Configuring Flutter environment...");
  try {
    const result = execSync("flutter doctor", { stdio: "pipe" }).toString();
    console.log(result);

    if (result.includes("Visual Studio") && result.includes("X")) {
      console.warn("⚠️ Visual Studio is not installed. This is only required for Windows desktop apps.");
    }

    console.log("✅ Flutter environment is ready (for Android development)!");
  } catch (error) {
    console.error("❌ Flutter environment configuration failed. Please open a new terminal and try again.");
    process.exit(1);
  }
}

function restartTerminalAsAdmin() {
  console.log("🔧 Restarting terminal as Administrator to apply changes...");
  execCommand("start powershell -Command \"Start-Process powershell -Verb runAs\"", "Restarting Terminal as Admin");
}

(async function main() {
  installChocoIfNeeded();
  installAll();
  ensureFlutterInPath();
  configureVSCodeForFlutter();
  await configureAndroidStudio();
  configureFlutterEnvironment();
  restartTerminalAsAdmin();
  console.log("🎉 Flutter development environment is fully ready!");
})();
