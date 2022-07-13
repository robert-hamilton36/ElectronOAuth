import React from 'react'
import LoginButton from './LoginButton';

interface Props {
  auth: User | null
}

interface User {
  login: string;
  avatar: string;
  bio: string;
}

export const Nav: React.FC<Props> = ({auth}) => {
  return (
    <div className='nav'>
      {auth ?
        <>
          <span className='bio'>{auth.bio}</span>
          <span className='login'>{auth.login}</span>
          <img src={auth.avatar} className='avatar'/>
        </>
        :
        <LoginButton />
      }
    </div>
  )
}
