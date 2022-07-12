import axios from 'axios'

interface Token {
  access_token: string
}

interface Repos {
  id: number;
  name: string;
  private: boolean;
}

interface User {
  login: string;
  avatar: string;
  bio: string;
}

// authorization token from the oAuth is saved here
let authorizationToken: Token | undefined

export const getUser = async () => {
  try {
    const response = await axios.get('https://api.github.com/user', {headers: { "Authorization" : `Bearer ${authorizationToken?.access_token}`}})
    
    // quick clean for pertinent user data
    const data: User = {
      login: response.data.login,
      avatar: response.data.avatar_url,
      bio: response.data.bio,
    }
    return data
  } catch (e) {
    console.log(e)
    throw new Error('getUser')
  }
}

export const getRepos = async () => {
  try {
    const response = await axios.get<Repos[]>('https://api.github.com/user/repos', {headers: { "Authorization" : `Bearer ${authorizationToken?.access_token}`}})

    // quick clean for pertinent repo data
    const repos: Repos[] = response?.data.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        private: repo.private
      }
    })

    return repos
  } catch(e) {
    console.log(e)
    throw new Error('getRepos')

  }
}

export const requestOAuthAccessToken = async (code: string) => {
  const tokenUrl = `https://github.com/login/oauth/access_token/?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&${code}`
  try{
    const response = await axios.get(tokenUrl, { headers: { 'Accept': 'application/json' } } )
    // saves oAuth token
    authorizationToken = response.data
    return 
  } catch (e) {
    console.log(e)
    throw new Error('requestOAuthToken')
  }
}
