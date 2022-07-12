import React from 'react'

interface Props {
  repos: Repos[]
}

interface Repos {
  id: number;
  name: string;
  private: boolean;
}

export const Repos: React.FC<Props> = ({ repos }) => {
  return (
    <ul className='list'>
      {repos.map((repo) => {
        return (
          <li key={repo.id}>
            {repo.name}
            <span className='private'>{repo.private && ' - Private'}</span>
          </li>
        )
      })}
    </ul>
  )
}
