import { shell } from 'electron';
import  { v4 as uuidv4 } from 'uuid'
import { getUser, requestOAuthAccessToken } from './api';
import { handleURLArgs } from './handleUrlArgs';

interface UserData {
  login: string;
  avatar: string;
  bio: string;
}

interface OAuthPromise {
  resolve: (value: UserData) => void;
  reject: (error: Error) => void;
}

let oAuthPromise: OAuthPromise | null = null
let responseState: string | null = null

const scope = ['repo']

// creates random state which github returns so you can then verify. Helps protect agianst xsrf
// create a promise
// opens up the github auth login screen
// this function doesn't resolve the promise by its self

export function showAuthWindow() {
  responseState = uuidv4()
  const authUrl = `https://github.com/login/oauth/authorize/?client_id=${process.env.CLIENT_ID}&scope=${scope}&state=${responseState}`
  return new Promise<UserData>((resolve, reject) => {
    oAuthPromise = { resolve, reject }
    return shell.openExternal(authUrl)
  })
}

// this function is called after github opens up the program again with the temporary code as an argument
// it parses the argument into a the code and the state
// it then verifys that the state saved internally matches the one sent by github
// if it does it then requests the oAuth token from github with the code
// once it recieves the authToken it gets the users data
// then it resolves the promise from above with the usersData

export const handleArgs = async (commandLineArgs: string[]) => {
  if (! oAuthPromise) throw new Error('Needs to be called during promise')
  const codeState = handleURLArgs(commandLineArgs)
  const [code, state] = codeState.split('&state=')
  // if states don't match potential 3rd party trying to authorize, end process
  if (state === responseState) {
    await requestOAuthAccessToken(code)
    const data = await getUser()
    oAuthPromise.resolve(data)
  } else {
    return oAuthPromise.reject(new Error('states do not match'))
  }
}
