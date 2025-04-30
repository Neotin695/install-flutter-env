#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

function execCommand(command, desc) {
  try {
    console.log(`🔧 ${desc}...`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Failed: ${desc}`);
    process.exit(1);
  }
}

function installChocoIfNeeded() {
  try {
    execSync("choco -v", { stdio: "ignore" });
    console.log("✅ Chocolatey is already installed.");
  } catch {
    console.log("⬇ Installing Chocolatey...");
    execCommand(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`
    );
  }
}

function installAll() {
  const tools = [
    // { name: "git", desc: "Installing Git" },
    { name: "vscode", desc: "Installing code" },
    { name: "flutter", desc: "Installing Flutter SDK" },
    { name: "androidstudio", desc: "Installing Android Studio" }
  ];

  tools.forEach(tool => {
    execCommand(`choco install ${tool.name} -y`, tool.desc);
  });
}

(function main() {
  installChocoIfNeeded();
  installAll();
  console.log("🎉 Flutter development environment is ready!");
})();
