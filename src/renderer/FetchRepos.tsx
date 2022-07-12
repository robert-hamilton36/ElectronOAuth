import React from 'react'

export const FetchRepos = () => {

  const handleClick = async () => {
    console.log('handle')
    await window.electronAPI.ipcRenderer.fetchRepos();
  }

  return (
    <button className='button' onClick={handleClick}>
      Fetch Repos
    </button>
  )
}
