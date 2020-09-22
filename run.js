const path = require("path");
const shelljs = require("shelljs");

function binDir(folder) {
  const webviewDir = path.dirname(
    require.resolve("@suchipi/webview/package.json")
  );
  return path.join(webviewDir, "bin", folder);
}

function run(options) {
  const {
    assetsDir,
    url,
    outDir,
    name = "webview",
    title = "webview",
  } = options;
  if (!outDir) {
    throw new Error("You must specify outDir.");
  }

  shelljs.mkdir("-p", outDir);

  shelljs.cp("-R", binDir("darwin-amd64"), outDir);
  shelljs.cp("-R", binDir("linux-amd64"), outDir);
  shelljs.cp("-R", binDir("windows-amd64"), outDir);

  shelljs.rm(path.join(outDir, "linux-amd64", "README.md"));
  shelljs.rm(path.join(outDir, "windows-amd64", "README.md"));

  shelljs.mv(
    path.join(outDir, "darwin-amd64", "webview"),
    path.join(outDir, "darwin-amd64", name)
  );

  shelljs.mv(
    path.join(outDir, "linux-amd64", "webview"),
    path.join(outDir, "linux-amd64", name)
  );

  shelljs.mv(
    path.join(outDir, "windows-amd64", "launcher.exe"),
    path.join(outDir, "windows-amd64", name + ".exe")
  );

  const launcherConfig = JSON.stringify(
    { title, webviewExe: name + ".exe" },
    null,
    2
  );

  shelljs
    .ShellString(launcherConfig)
    .toEnd(path.join(outDir, "windows-amd64", "launcher.json"));

  if (assetsDir) {
    shelljs.cp("-R", assetsDir, path.join(outDir, "darwin-amd64", "public"));
    shelljs.cp("-R", assetsDir, path.join(outDir, "linux-amd64", "public"));
    shelljs.cp("-R", assetsDir, path.join(outDir, "windows-amd64", "public"));

    const webViewConfig = JSON.stringify({ dir: "./public", title }, null, 2);

    shelljs
      .ShellString(webViewConfig)
      .toEnd(path.join(outDir, "darwin-amd64", "webview.json"));
    shelljs
      .ShellString(webViewConfig)
      .toEnd(path.join(outDir, "linux-amd64", "webview.json"));
    shelljs
      .ShellString(webViewConfig)
      .toEnd(path.join(outDir, "windows-amd64", "webview.json"));
  } else if (url) {
    const webViewConfig = JSON.stringify({ url, title }, null, 2);

    shelljs
      .ShellString(webViewConfig)
      .toEnd(path.join(outDir, "darwin-amd64", "webview.json"));
    shelljs
      .ShellString(webViewConfig)
      .toEnd(path.join(outDir, "linux-amd64", "webview.json"));
    shelljs
      .ShellString(webViewConfig)
      .toEnd(path.join(outDir, "windows-amd64", "webview.json"));
  } else {
    throw new Error("You must specify either assetsDir or url.");
  }

  shelljs.mkdir("-p", path.join(outDir, name + ".app", "Contents", "MacOS"));
  shelljs.mv(
    path.join(outDir, "darwin-amd64", "*"),
    path.join(outDir, name + ".app", "Contents", "MacOS")
  );
  shelljs.mv(
    path.join(outDir, name + ".app"),
    path.join(outDir, "darwin-amd64")
  );

  shelljs
    .ShellString(
      `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>English</string>
    <key>CFBundleDisplayName</key>
    <string>${title}</string>
    <key>CFBundleName</key>
    <string>${name}</string>
    <key>NSHighResolutionCapable</key>
    <true />
    <key>CFBundleExecutable</key>
    <string>${name}</string>
    </dict>
  </plist>
  `
    )
    .toEnd(
      path.join(outDir, "darwin-amd64", name + ".app", "Contents", "Info.plist")
    );

  console.log(`Contents written to '${outDir}'.`);
}

module.exports = run;
