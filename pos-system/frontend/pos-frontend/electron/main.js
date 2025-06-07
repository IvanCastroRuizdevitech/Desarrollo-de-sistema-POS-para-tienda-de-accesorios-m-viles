const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

// Configurar almacenamiento persistente
const store = new Store();

// Mantener una referencia global del objeto window para evitar que la ventana se cierre automáticamente
// cuando el objeto JavaScript es recogido por el recolector de basura.
let mainWindow;

// Crear la ventana principal
function createWindow() {
  // Obtener el tamaño de la ventana guardado o usar valores predeterminados
  const windowSize = store.get('windowSize') || { width: 1200, height: 800 };
  
  mainWindow = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false, // No mostrar hasta que esté listo
  });

  // Cargar la aplicación React
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Abrir DevTools en desarrollo
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Guardar el tamaño de la ventana cuando se cierra
  mainWindow.on('close', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowSize', { width, height });
  });

  // Cuando la ventana se cierra, eliminar la referencia
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Crear menú
  createMenu();
}

// Crear menú de la aplicación
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Configuración',
          click: () => {
            // Implementar configuración
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'delete', label: 'Eliminar' },
        { type: 'separator' },
        { role: 'selectAll', label: 'Seleccionar todo' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar recarga' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: 'POS System',
              message: 'Sistema POS para tienda de accesorios móviles',
              detail: `Versión: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}`,
              buttons: ['OK'],
              icon: path.join(__dirname, '../assets/icon.png')
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Crear ventana cuando la aplicación esté lista
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// En macOS, recrear la ventana cuando se haga clic en el icono del dock
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Manejar eventos IPC desde el renderer
ipcMain.handle('get-app-path', () => app.getPath('userData'));
ipcMain.handle('get-app-version', () => app.getVersion());

// Manejar eventos IPC para diálogos
ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(options);
  return result;
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result;
});

// Manejar eventos IPC para almacenamiento
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
  return true;
});

