const { app, BrowserWindow, protocol, net, dialog, Menu, shell } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

// Постоянный адрес игры — от него зависят сохранения (localStorage). Не менять!
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const GAME = path.join(__dirname, 'game');
// Сохранения всегда в одной папке, даже если игру переименуют: %APPDATA%\hotline-spb
app.setPath('userData', path.join(app.getPath('appData'), 'hotline-spb'));
let win;

if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function createWindow() {
  win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 640, minHeight: 360,
    backgroundColor: '#000000', show: false, autoHideMenuBar: true,
    title: 'Hotline Saint-P',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true, backgroundThrottling: false }
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.on('page-title-updated', e => e.preventDefault());
  win.webContents.on('before-input-event', (e, inp) => {
    if (inp.type !== 'keyDown') return;
    if (inp.key === 'F11' || (inp.alt && inp.key === 'Enter')) { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (inp.control && inp.shift && inp.key.toLowerCase() === 'i') win.webContents.toggleDevTools();
  });
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.loadURL('app://game/index.html');
}

function setupUpdater() {
  if (!app.isPackaged) return;
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch (e) { return; }
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('error', () => {}); // нет интернета — просто играем дальше
  autoUpdater.on('download-progress', p => { if (win) win.setProgressBar(p.percent / 100); });
  autoUpdater.on('update-downloaded', async info => {
    if (win) win.setProgressBar(-1);
    const r = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['Перезапустить сейчас', 'Позже'], defaultId: 0, cancelId: 1,
      title: 'Обновление', message: 'Скачана новая версия ' + info.version,
      detail: 'Перезапустить игру и обновиться? Если нажать «Позже», обновление установится само, когда закроешь игру. Сохранения не пропадут.'
    });
    if (r.response === 0) autoUpdater.quitAndInstall(true, true);
  });
  autoUpdater.checkForUpdates().catch(() => {});
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 30 * 60 * 1000);
}

app.whenReady().then(() => {
  protocol.handle('app', req => {
    const u = new URL(req.url);
    let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.normalize(path.join(GAME, rel));
    if (!file.startsWith(GAME)) return new Response('forbidden', { status: 403 });
    return net.fetch(pathToFileURL(file).toString(), { headers: req.headers });
  });
  createWindow();
  setupUpdater();
});
app.on('window-all-closed', () => app.quit());
