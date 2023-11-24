import { html } from 'htm/react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

export default ({ title, message, onConfirm, onCancel }) => {
  return html`
    <${Dialog}
      open=${true}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onClose=${onCancel}
    >
      <${DialogTitle} id="confirm-title">
        ${title}
      </>
      <${DialogContent}>
        <${DialogContentText} id="confirm-message">
          ${message}
        </>
      </>
      <${DialogActions}>
        <${Button} onClick=${onCancel}>
          Cancel
        </>
        <${Button} onClick=${onConfirm}>
          OK
        </>
      </>
    </>
  `
}
