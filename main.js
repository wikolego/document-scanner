const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// Development mode check
const isDev = !app.isPackaged

let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the appropriate URL
  const startUrl = isDev
    ? 'http://localhost:3001'
    : `file://${path.join(__dirname, 'dist/index.html')}`

  console.log('Loading URL:', startUrl)

  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', err)
  })

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow()
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// On macOS, recreate window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
