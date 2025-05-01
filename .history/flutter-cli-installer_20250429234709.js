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

function configureAndroidStudio() {
  console.log("🔧 Setting up Android Studio for Flutter...");
  execCommand("flutter doctor --android-licenses", "Accepting Android licenses");
  execCommand("flutter doctor", "Running flutter doctor to check the environment");
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

function ensureFlutterInPath() {
  console.log("🔧 Ensuring Flutter is in PATH...");

  const flutterBinPath = "C:\\tools\\flutter\\bin";  // Change this path if Flutter is installed in a different location

  // Check if Flutter is in PATH
  const pathEnv = process.env.PATH.split(';');
  if (!pathEnv.includes(flutterBinPath)) {
    console.log("⬇ Adding Flutter to PATH...");

    // Add Flutter to User PATH
    execCommand(`setx PATH "${process.env.PATH};${flutterBinPath}"`, "Adding Flutter to User PATH");

    // Add Flutter to System PATH
    execCommand(`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v PATH /t REG_EXPAND_SZ /f /d "%PATH%;${flutterBinPath}"`, "Adding Flutter to System PATH");
  } else {
    console.log("✅ Flutter is already in PATH.");
  }
}

function restartTerminalAsAdmin() {
  console.log("🔧 Restarting terminal as Administrator to apply changes...");
  // Restart the terminal as administrator
  execCommand("start powershell -Command \"Start-Process powershell -Verb runAs\"", "Restarting Terminal as Admin");
}

(function main() {
  installChocoIfNeeded();
  installAll();
  ensureFlutterInPath();  // Ensure Flutter is added to PATH
  configureVSCodeForFlutter();
  configureAndroidStudio();
  configureFlutterEnvironment();
  restartTerminalAsAdmin();  // Restart terminal as Admin to apply changes
  console.log("🎉 Flutter development environment is fully ready!");
})();
