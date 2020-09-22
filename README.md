# webview-packager

This application creates native desktop webview applications suitable for showing web content, by leveraging [suchipi/webview](https://github.com/suchipi/webview).

You can configure it to either open a webview window and navigate to a URL, or open a webview window and show content from a folder (which will be served by a local http server).

## Usage

To make a webview wrapper for a URL:

```
npx webview-packager --name myApp --title "My App" --outDir "./bin" --url "https://my-app.example.com"
```

To make a webview wrapper for some files:

```
npx webview-packager --name myApp --title "My App" --outDir "./bin" --assetsDir "./public"
```

## TODO

- [x] Generate binaries for macOS, Windows, and Linux
- [x] Set up a basic macOS Info.plist
- [ ] Create `.desktop` files for Linux
- [ ] Automatically convert icons and put them in the right place (icns, resource hacker, pixmap, etc)
