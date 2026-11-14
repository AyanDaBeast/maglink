# Maglink

A small browser-based WebTorrent demo for opening magnet links and accessing torrent files. Only use it with content you have permission to access.

## Run in GitHub Codespaces

1. Open this repository in a Codespace. The dev container starts a static server on port `8000` and forwards the port automatically.
2. Open the forwarded **Maglink web app** port from the Ports tab if it does not open automatically.
3. Paste a `magnet:` link and select **Open magnet**.

To start the server manually (for example, in a non-Codespaces environment):

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Then visit `http://localhost:8000`.

## Browser and network limitations

This app uses WebTorrent's browser build. Browsers can connect only to peers that support WebRTC, so a torrent with no WebRTC-capable peers may not start or finish. Keep the page open while downloading. Video playback depends on the browser's media-format support and may be available only after enough data has arrived.

The WebTorrent library is loaded from jsDelivr, so an internet connection is required. This static app does not run a torrent client or proxy in the Codespace.
