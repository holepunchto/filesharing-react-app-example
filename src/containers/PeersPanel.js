import { html } from 'htm/react'
import usePeers from '../hooks/use-peers'
import Peer from '../components/Peer'
import { Box, Typography } from '@mui/material'

export default () => {
  const { peers } = usePeers()

  return html`
    <${Box} sx=${{ margin: 1 }}>
      <${Typography} variant="h4">
        Your peers
      </>
      ${Object.entries(peers).map(([key, peer]) => html`
        <${Peer}
          key=${key}
          hyperdrive=${peer.hyperdrive}
        />
      `)}
    </>
  `
}
