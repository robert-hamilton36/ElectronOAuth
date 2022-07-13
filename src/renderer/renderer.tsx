import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App';

declare global {
  interface Window {
    electronAPI: {
      onUser: (callback: any) => Electron.IpcRenderer
      onRepos: (callback: any) => Electron.IpcRenderer
      ipcRenderer: {
        fetchAuth: () => Promise<void>,
        fetchRepos: () => Promise<void>
      }
    };
  }
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)