const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron')
const path = require('path')
const axios = require('axios').default
const { v4: uuidv4 } = require('uuid')

let authorizationToken

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

 mainWindow.loadFile('index.html')

}

const handleURLArgs = (args) => {
  const urlArg = args.filter((arg) => {
    return arg.includes('electron-auth')
  })
  const parseUrl = urlArg[0].split('?').pop()
  return parseUrl
}

const getUser = async (token) => {
  try {
    const response = await axios.get('https://api.github.com/user', {headers: { "Authorization" : `Bearer ${authorizationToken.access_token}`}})
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getRepos = async () => {
  try{
    const response = await axios.get('https://api.github.com/user/repos', {headers: { "Authorization" : `Bearer ${authorizationToken.access_token}`}})
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const options = {
  client_id: '',
  client_secret: '',
  scopes: ['repo'], // Scopes limit access for OAuth tokens.
}

const requestOAuthAccessToken = async (code) => {
  const tokenUrl = `https://github.com/login/oauth/access_token/?client_id=${options.client_id}&client_secret=${options.client_secret}&${code}`
  const response = await axios.get(tokenUrl, { headers: { 'Accept': 'application/json' } } )
  return response
}

let oAuthPromise
let responseState
let mainWindow

function showAuthWindow() {
  responseState = uuidv4()
  const authUrl = `https://github.com/login/oauth/authorize/?client_id=${options.client_id}&scope=${options.scopes}&state=${responseState}`
  return new Promise((resolve, reject) => {
    oAuthPromise = { resolve, reject }
    return shell.openExternal(authUrl)
  })
}

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
  console.log('duplicate')
} else {
  app.on('second-instance', async (_event, commandLineArgs) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    
    const codeState = handleURLArgs(commandLineArgs)
    const [code, state] = codeState.split('&state=')
    // if states don't match potential 3rd party trying to authorize, end process
    if (state === responseState) {
      const accessToken = await requestOAuthAccessToken(code)
      authorizationToken = accessToken.data
      const data = await getUser(accessToken.data)
      oAuthPromise.resolve(data)
    } else {
      return oAuthPromise.reject(new Error('states do not match'))
    }
  })
    
  app.on('ready', () => {
    createWindow(mainWindow)
    mainWindow.webContents.send('consoleLog', 'start')
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(mainWindow)
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
    const userData = {
      login: data.login,
      avatar: data.avatar_url,
      bio: data.bio
    }
    mainWindow.webContents.send('send-user', userData)
  } catch (error) {
    return error
  }
})

ipcMain.on('fetch-repos', async () => {
  try {
    const data = await getRepos()
    const repos = data.map((repo) => repo.name)
    mainWindow.webContents.send('sendRepos', repos)
  } catch (error) {
    return error
  }
})