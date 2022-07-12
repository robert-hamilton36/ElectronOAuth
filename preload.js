// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')

// Set up context bridge between the renderer process and the main process
contextBridge.exposeInMainWorld('electronAPI', {
  onUser: (callback) => ipcRenderer.on('send-user', callback),
  onRepos: (callback) => ipcRenderer.on('send-repos', callback),
  ipcRenderer: {
    fetchAuth() {
      return ipcRenderer.send('fetch-auth');
    },
    fetchRepos() {
      return ipcRenderer.send('fetch-repos');
    }
  },
});