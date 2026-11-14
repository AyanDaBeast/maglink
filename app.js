const form = document.getElementById('magnetForm');
const magnetInput = document.getElementById('magnetInput');
const loadButton = document.getElementById('loadButton');
const fileList = document.getElementById('fileList');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let client;

function setStatus(message) {
  statusText.textContent = message;
}

function setProgress(progress = 0) {
  const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));
  progressBar.value = percent;
  progressText.textContent = `${percent}%`;
}

function showEmptyFiles(message) {
  fileList.replaceChildren();
  const item = document.createElement('li');
  item.className = 'empty';
  item.textContent = message;
  fileList.append(item);
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const amount = bytes / 1024 ** index;
  return `${amount.toFixed(amount >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function showTorrentFiles(torrent) {
  fileList.replaceChildren();

  if (!torrent.files.length) {
    showEmptyFiles('This torrent did not provide any files.');
    return;
  }

  for (const file of torrent.files) {
    const item = document.createElement('li');
    item.className = 'file-item';
    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = file.name;
    const size = document.createElement('span');
    size.className = 'file-size';
    size.textContent = formatBytes(file.length);
    const actions = document.createElement('div');
    actions.className = 'file-actions';
    item.append(name, size, actions);
    fileList.append(item);

    // WebTorrent exposes completed files as Blob URLs in browser builds.
    if (typeof file.getBlobURL === 'function') {
      file.getBlobURL((error, url) => {
        if (error || !url) return;
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = file.name.match(/\.(mp4|webm|ogg|mp3|wav|m4a)$/i) ? 'Play / open' : 'Open / save';
        actions.append(link);
      });
    } else {
      const message = document.createElement('span');
      message.className = 'file-size';
      message.textContent = 'File preview is not supported by this browser build.';
      actions.append(message);
    }
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const magnet = magnetInput.value.trim();

  if (!/^magnet:\?/i.test(magnet)) {
    setStatus('Enter a valid magnet: link.');
    magnetInput.focus();
    return;
  }

  if (!window.WebTorrent) {
    setStatus('The WebTorrent browser library did not load. Check your connection and refresh.');
    return;
  }

  loadButton.disabled = true;
  setProgress(0);
  showEmptyFiles('Waiting for torrent metadata…');
  setStatus('Connecting to compatible WebRTC peers…');

  if (client) client.destroy();
  client = new WebTorrent();

  client.on('error', (error) => {
    setStatus(`Torrent client error: ${error.message || error}`);
    loadButton.disabled = false;
  });

  client.add(magnet, (torrent) => {
    setStatus(`Loaded ${torrent.name || 'torrent metadata'}. Waiting for compatible peers…`);
    showTorrentFiles(torrent);

    torrent.on('download', () => setProgress(torrent.progress));
    torrent.on('done', () => {
      setProgress(1);
      setStatus('Download complete. Open a file above to play or save it.');
      loadButton.disabled = false;
    });
    torrent.on('wire', () => setStatus('Connected to a peer. Downloading…'));
    torrent.on('warning', (warning) => console.warn('Torrent warning:', warning));
    torrent.on('error', (error) => {
      setStatus(`Torrent error: ${error.message || error}`);
      loadButton.disabled = false;
    });

    if (torrent.progress > 0) setProgress(torrent.progress);
  });
});
