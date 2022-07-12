import React, { useEffect, useState } from 'react'
import { FetchRepos } from './FetchRepos';
import { Nav } from './Nav';
import { Repos } from './Repos';

interface User {
  login: string;
  avatar: string;
  bio: string;
}

interface Repos {
  id: number;
  name: string;
  private: boolean;
}

export function App() {
  const [auth, setAuth] = useState<User | null>(null)
  const [repos, setRepos] = useState<Repos[] | null>(null)

  useEffect(() => {
    window.electronAPI.onUser((_event: String, value: User) => {
      setAuth(value)
    })
  }, [])

  useEffect(() => {
    window.electronAPI.onRepos((_event: String, value: Repos[]) => {
      setRepos(value)
    })
  }, [])

  return(
    <div className='container'>
      <Nav auth={auth}/>
      <div className='content'>
        { auth && !repos && <FetchRepos />}
        { repos && <Repos repos={repos} />}
      </div>
    </div>
  )
}