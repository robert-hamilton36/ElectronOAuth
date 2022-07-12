import React from 'react'

export const FetchRepos = () => {

  const handleClick = async () => {
    await window.electronAPI.ipcRenderer.fetchRepos();
  }

  return (
    <button className='button' onClick={handleClick}>
      Fetch Repos
    </button>
  )
}
