import React from 'react'

interface Props {
  repos: string[]
}

export const Repos: React.FC<Props> = ({ repos }) => {
  return (
    <ul>
      {repos.map((repo) => <li>{repo}</li>)}
    </ul>
  )
}
