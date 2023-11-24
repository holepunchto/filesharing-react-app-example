import { html } from 'htm/react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

export default ({ title, message, onClose }) => {
  return html`
    <${Dialog}
      open=${true}
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
      onClose=${onClose}
    >
      <${DialogTitle} id="alert-title">
        ${title}
      </>
      <${DialogContent}>
        <${DialogContentText} id="alert-message">
          ${message}
        </>
      </>
      <${DialogActions}>
        <${Button} onClick=${onClose}>
          OK
        </>
      </>
    </>
  `
}
