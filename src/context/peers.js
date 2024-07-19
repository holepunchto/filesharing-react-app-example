/* global Pear */

import { createContext, useEffect, useState, useRef } from 'react'
import { html } from 'htm/react'
import Hyperbee from 'hyperbee'
import Hyperdrive from 'hyperdrive'
import Hyperswarm from 'hyperswarm'
import useUser from '../hooks/use-user'
import ProtomuxRPC from 'protomux-rpc'
import hic from 'hypercore-id-encoding'

const PeersContext = createContext()

function PeersProvider ({ name, topic, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const user = useUser()
  const [peers, setPeers] = useState([])
  const hyperswarm = useRef()
  const hyperbee = new Hyperbee(user.corestore.get({
    name: 'peers'
  }), {
    keyEncoding: 'utf-8',
    valueEncoding: 'json'
  })

  useEffect(() => {
    loadPeers()
      .then(initSwarm)
      .then(() => setLoaded(true))

    async function loadPeers () {
      for await (const { key, value: { driveKey } } of hyperbee.createReadStream()) {
        add({ key, driveKey })
      }
    }

    async function initSwarm () {
      hyperswarm.current = new Hyperswarm({
        keyPair: await user.corestore.createKeyPair('first-app')
      })

      Pear.teardown(async () => {
        await hyperswarm.current.destroy()
      })

      hyperswarm.current.on('connection', async (conn, info) => {
        const key = conn.remotePublicKey.toString('hex')
        const rpc = new ProtomuxRPC(conn)
        console.log('[connection joined]', info)
        // TODO: Set online status
        // knownPeersOnlineStatus[key] = true

        user.corestore.replicate(conn)

        // If someone asks who we are, then tell them our driveKey
        rpc.respond('whoareyou', async req => {
          console.log('[whoareyou respond]')
          return Buffer.from(JSON.stringify({
            driveKey: user.hyperdrive.key.toString('hex')
          }))
        })

        conn.on('close', () => {
          console.log(`[connection left] ${conn}`)
          console.log('should update online status')
        })

        // If we have never seen the peer before, then ask them who they are so
        // we can get their hyperdrive key.
        // On subsequent boots we already know them, so it doesn't matter if they
        // are online or not, before we can see and download their shared files
        // as long as someone in the network has accessed them.
        const peer = await hyperbee.get(key)
        const isAlreadyKnownPeer = !!peer
        if (isAlreadyKnownPeer) return

        console.log('[whoareyou request] This peer is new, ask them for their hyperdrive key')
        const reply = await rpc.request('whoareyou')
        const { driveKey } = JSON.parse(reply.toString())
        await add({
          key,
          driveKey
        })
      })

      // If this is an example app, then this key preferably should not be in sourcecode
      // But the app.key may not exist before `pear stage/release` has been called, so
      // maybe there is another 32-byte key we can use?
      const discovery = hyperswarm.current.join(hic.decode(topic), { server: true, client: true })
      await discovery.flushed()
    }
  }, [])

  async function add ({ key, driveKey }) {
    console.log(`[PeersProvider] add() key=${key} driveKey=${driveKey}`)
    const hyperdrive = new Hyperdrive(user.corestore, driveKey)
    await hyperdrive.ready()
    await hyperbee.put(key, { driveKey })

    setPeers(peers => ({
      ...peers,
      [key]: {
        hyperdrive
      }
    }))
  }

  return html`
    <${PeersContext.Provider}
      value=${{
        loaded,
        peers
      }}
      ...${props}
    />
  `
}

export { PeersContext, PeersProvider }
