import { html } from 'htm/react'
import useUser from '../hooks/use-user'
import FilesList from '../components/FilesList'
import {
  Box,
  Typography
} from '@mui/material'

export default () => {
  const { hyperdrive, files } = useUser()

  return html`
    <${Box} sx=${{ margin: 1 }}>
      <${Typography} variant="h4">Your shared files</>
      <${FilesList}
        hyperdrive=${hyperdrive}
        files=${files}
        allowDeletion
      />
    </>
  `
}
