import { BrowserWindow } from 'electron'
import path from 'path'

export const createWindow = () => {
  let mainWindow
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
  return mainWindow
}