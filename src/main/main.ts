import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { getRepos } from './api'
import { handleArgs, showAuthWindow } from './auth'
import { createWindow } from './createWindow'

let mainWindow: BrowserWindow | null = null
// sets protocol name to open from terminal
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('electron-auth', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('electron-auth')
}

const appHasLock = app.requestSingleInstanceLock()
const appIsDuplicate = !appHasLock

if (appIsDuplicate) {
  
} else {
  app.on('second-instance', async (_event, commandLineArgs) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    try {
      handleArgs(commandLineArgs)
    } catch(e){
      console.log(e)
    }
    
  })
    
  app.on('ready', () => {
    mainWindow = createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)mainWindow = createWindow()
    })
  })
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('fetch-auth', async () => {
  try {
    const data = await showAuthWindow()
    mainWindow?.webContents.send('send-user', data)
  } catch (error) {
    return error
  }
})

ipcMain.on('fetch-repos', async () => {
  try {
    const repos = await getRepos()
    mainWindow?.webContents.send('send-repos', repos)
  } catch (error) {
    return error
  }
})