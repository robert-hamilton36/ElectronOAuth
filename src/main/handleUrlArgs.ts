export const handleURLArgs = (args: string[]) => {
  const urlArg = args.filter((arg) => {
    return arg.includes('electron-auth')
  })
  const parseUrl = urlArg[0].split('?').pop()
  if (parseUrl) {
    return parseUrl
  } else {
    throw new Error('no url arguments')
  }
}