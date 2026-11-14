# Maglink

A small browser-based WebTorrent demo for opening magnet links and accessing torrent files. Only use it with content you have permission to access.

## Run

With Node.js 22 or newer installed, run:

```bash
npm start
```

Then open [http://localhost:8000](http://localhost:8000). No `npm install` is needed; the static web server uses Node.js built-ins.

## Run in GitHub Codespaces

Open this repository in a Codespace, then run `npm start` in the terminal. Codespaces forwards port `8000` and opens the app in a browser. If it does not, open the **Ports** tab and click the forwarded port.

## Browser and network limitations

This app uses WebTorrent's browser build. Browsers can connect only to peers that support WebRTC, so a torrent with no WebRTC-capable peers may not start or finish. Keep the page open while downloading. Video playback depends on the browser's media-format support and may be available only after enough data has arrived.

The WebTorrent library is loaded from jsDelivr, so an internet connection is required. This static app does not run a torrent client or proxy in the Codespace.
