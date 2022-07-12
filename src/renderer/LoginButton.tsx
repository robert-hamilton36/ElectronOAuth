import React from 'react'

export default function LoginButton() {
  const handleClick = async () => {
    await window.electronAPI.ipcRenderer.fetchAuth();
  };
  return (
    <button className='button' type="button" onClick={handleClick}>
      Login through github
    </button>
  );
}