import { teardown } from 'pear'
import { createContext, useEffect, useRef, useState } from 'react'
import { html } from 'htm/react'
import Corestore from 'corestore'
import Hyperdrive from 'hyperdrive'
import Localdrive from 'localdrive'
import downloadsFolder from 'downloads-folder'

const UserContext = createContext()

function UserProvider ({ config, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [profile, setProfile] = useState({})
  const [files, setFiles] = useState([])
  const corestoreRef = useRef(new Corestore(config.storage))
  const hyperdriveRef = useRef(new Hyperdrive(corestoreRef.current))
  const localdriveRef = useRef(new Localdrive(downloadsFolder()))

  // Does it make sense to put here??
  teardown(async () => {
    await corestoreRef.current.close()
  })

  useEffect(() => {
    hyperdriveRef.current.ready()
      .then(initProfile)
      .then(getProfile)
      .then(getFiles)
      .then(() => setLoaded(true))
  }, [hyperdriveRef])

  async function initProfile () {
    const exists = await hyperdriveRef.current.exists('/meta/profile.json')
    if (exists) return
    await updateProfile({ name: 'No name' })
  }

  async function updateProfile (profile) {
    await hyperdriveRef.current.put('/meta/profile.json', Buffer.from(JSON.stringify(profile)))
  }

  async function getProfile () {
    console.log('[UserProvider] getProfile()')
    const buf = await hyperdriveRef.current.get('/meta/profile.json')
    setProfile(JSON.parse(buf))
  }

  async function getFiles () {
    console.log('[UserProvider] getFiles()')
    const newFiles = []
    const stream = hyperdriveRef.current.list('/files', { recursive: false })
    for await (const file of stream) {
      newFiles.push(file)
    }
    setFiles(newFiles)
  }

  useEffect(() => {
    const profileWatcher = hyperdriveRef.current.watch('/meta', { recursive: false })

    watchForever()
    async function watchForever () {
      for await (const _ of profileWatcher) { // eslint-disable-line no-unused-vars
        await getProfile()
      }
    }

    return async () => {
      await profileWatcher.destroy()
    }
  }, [hyperdriveRef.current])

  useEffect(() => {
    const filesWatcher = hyperdriveRef.current.watch('/files')

    watchForever()
    async function watchForever () {
      for await (const _ of filesWatcher) { // eslint-disable-line no-unused-vars
        await getFiles()
      }
    }

    return async () => {
      await filesWatcher.destroy()
    }
  }, [hyperdriveRef.current])

  return html`
    <${UserContext.Provider}
      value=${{
        loaded,
        profile,
        updateProfile,
        files,
        corestore: corestoreRef.current,
        hyperdrive: hyperdriveRef.current,
        localdrive: localdriveRef.current,
        downloadsFolder: downloadsFolder()
      }}
      ...${props}
    />
  `
}

export { UserContext, UserProvider }
