const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example function to send from renderer to main
  sendToMain: (channel, data) => {
    // whitelist channels
    const validChannels = ['toMain', 'scan-document']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // Example function to receive from main to renderer
  receiveFromMain: (channel, func) => {
    const validChannels = ['fromMain', 'scan-result']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})
