import { html } from 'htm/react'
import { useState } from 'react'
import {
  IconButton,
  ListItemButton,
  CircularProgress,
  Typography,
  ListItemIcon
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import useUser from '../hooks/use-user'
import Confirm from '../components/Confirm'
import Alert from '../components/Alert'

export default ({ file, hyperdrive, allowDeletion = false }) => {
  const user = useUser()
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState('')
  const [showDownloadMessage, setShowDownloadMessage] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const filename = file.key.split('/').pop()

  async function download () {
    console.log(`[FileListItem] Downloading ${filename} to ${user.downloadsFolder}`)

    const ws = user.localdrive.createWriteStream(filename)
    const rs = hyperdrive.createReadStream(file.key, {
      timeout: 10000 // is this timeout untit it starts, or until it ends?
    })

    setShowSpinner(true)

    rs.pipe(ws)
    rs.on('end', () => {
      setShowSpinner(false)
      setDownloadMessage(`${filename} was downloaded to ${user.downloadsFolder}`)
      setShowDownloadMessage(true)
    })
    rs.on('error', err => {
      const hasTimedOut = err.message.includes('REQUEST_TIMEOUT')
      setErrorMessage(hasTimedOut
        ? `Could not start download of ${filename}. Maybe the network does not have the file.`
        : err.message
      )
      setShowErrorMessage(true)
      setShowSpinner(false)
    })
  }

  return html`
    <${ListItemButton} onClick=${download}>
      <${ListItemIcon} size="small">
        <${InsertDriveFileIcon} size=${10} />
      </>
      <${Typography} variant="h7" sx=${{ flexGrow: 1 }}>
        ${filename}
      </>
      ${showSpinner && html`
        <${CircularProgress} size=${20} />
      `}
      ${allowDeletion && !showSpinner && html`
        <${IconButton}
          size="small"
          onClick=${() => setShowDeletePrompt(true)}
          edge="end"
          aria-label="delete"
        >
          <${DeleteIcon} fontSize="small" />
        </>
      `}
    </>
    ${showDeletePrompt && html`
      <${Confirm}
        title="Confirm"
        message=${`Are you sure you want to stop sharing ${filename}?`}
        onCancel=${() => setShowDeletePrompt(false)}
        onConfirm=${async () => {
          setShowDeletePrompt(false)
          setShowSpinner(true)
          await hyperdrive.del(file.key)
          setShowSpinner(false)
        }}
      />
    `}
    ${showErrorMessage && html`
      <${Alert}
        title="Error"
        message=${errorMessage}
        onClose=${() => setShowErrorMessage(false)}
      />
    `}
    ${showDownloadMessage && html`
      <${Alert}
        title="Downloaded"
        message=${downloadMessage}
        onClose=${() => setShowDownloadMessage(false)}
      />
    `}
  `
}
