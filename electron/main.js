import { app, BrowserWindow } from 'electron/main';
import path from 'node:path';
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";

const isDev = process.env.NODE_ENV === 'development';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "florr.io - AyuScript"
  });

  win.loadURL('https://florr.io/').then(() => {
    win.webContents.executeJavaScript(`
      window.electron = true
    `);
    if (isDev) {
      win.webContents.executeJavaScript(`
        import('http://localhost:5173/__vite-plugin-monkey.install.user.js')
      `);
      win.webContents.openDevTools();
    } else {
      const jsPath = path.join(__dirname, '../dist/ayuscript.user.js');
      const code = readFileSync(jsPath, 'utf-8');
      win.webContents.executeJavaScript(code);
    }
  });
  win.on('page-title-updated', (event) => {
    event.preventDefault();
  });
  win.on('close', (event) => {
    event.preventDefault()
    win.destroy();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});