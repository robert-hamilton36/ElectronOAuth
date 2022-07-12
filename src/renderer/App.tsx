import React, { useEffect, useState } from 'react'
import { FetchRepos } from './FetchRepos';
import { Nav } from './Nav';
import { Repos } from './Repos';

interface User {
  login: string;
  avatar: string;
  bio: string;
}

export function App() {
  const [auth, setAuth] = useState<User | null>(null)
  const [repos, setRepos] = useState<string[] | null>(null)

  useEffect(() => {
    window.electronAPI.onUser((_event: String, value: User) => {
      console.log(value)
      setAuth(value)
    })
  }, [])

  useEffect(() => {
    window.electronAPI.onRepos((_event: String, value: string[]) => {
      console.log(value)
      setRepos(value)
    })
  }, [])

  console.log(auth)
  return(
    <div className='container'>
      <Nav auth={auth}/>
      <div className='mainContainer'>
        { auth && !repos && <FetchRepos />}
        { repos && <Repos repos={repos} />}
      </div>
    </div>
  )
}