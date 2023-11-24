import { useState, useEffect } from 'react'

export default ({ hyperdrive }) => {
  const [profile, setProfile] = useState({})
  const [files, setFiles] = useState([])

  useEffect(() => {
    getProfile()
    getFiles()
  }, [])

  async function getProfile() {
    console.log('[use-peer] getProfile()')
    const buf = await hyperdrive.get('/meta/profile.json')
    setProfile(JSON.parse(buf))
  }

  async function getFiles() {
    console.log('[use-peer] getFiles()')
    const newFiles = []
    const stream = hyperdrive.list('/files', { recursive: false })
    for await (const file of stream) {
      newFiles.push(file)
    }
    setFiles(newFiles)
  }

  useEffect(() => {
    const profileWatcher = hyperdrive.watch('/meta', { recursive: false })

    watchForever()
    async function watchForever() {
      for await (const _ of profileWatcher) {
        await getProfile()
      }
    }

    return async () => {
      await profileWatcher.destroy()
    }
  }, [hyperdrive])

  useEffect(() => {
    const filesWatcher = hyperdrive.watch('/files')

    watchForever()
    async function watchForever() {
      for await (const _ of filesWatcher) {
        await getFiles()
      }
    }

    return async () => {
      await filesWatcher.destroy()
    }
  }, [hyperdrive])

  return {
    profile,
    files
  }
}
