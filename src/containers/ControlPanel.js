import { html } from 'htm/react'
import { useState } from 'react'
import useUser from '../hooks/use-user'
import styled from 'styled-components'
import {
  AppBar,
  Box,
  Button,
  Toolbar
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Prompt from '../components/Prompt'

export default () => {
  const user = useUser()
  const [showChangeName, setShowChangeName] = useState(false)
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  return html`
    <${AppBar} position="static">
      <${Toolbar}>
        <${Box} sx=${{ flexGrow: 1}}>
          <${Button} component="label">
            Add files
            <${VisuallyHiddenInput}
              type="file"
              multiple
              onChange=${async e => {
                for (const file of e.target.files) {
                  const data = await file.arrayBuffer()
                  user.hyperdrive.put(`/files/${file.name}`, data)
                }
              }}
            />
          </>
          <!--
          <${Button}
            onClick=${async () => {
              const randomFilename = `file-${Math.floor(1000000 * Math.random())}.txt`
              await user.hyperdrive.put(`/files/${randomFilename}`, Buffer.from('hello world'))
            }}
          >
            Create random file
          </>
          -->
        </>
        <${Button}
          onClick=${() => setShowChangeName(true)}
        >
          ${user.profile.name}
          <${AccountCircleIcon} sx=${{ marginLeft: '10px' }}/>
        </>
        ${showChangeName && html`
          <${Prompt}
            title="Change name"
            label="Name"
            initialResponse=${user.profile.name}
            onCancel=${() => setShowChangeName(false)}
            onResponse=${async newName => {
              setShowChangeName(false)
              const newProfile = { name: newName }
              await user.updateProfile(newProfile)
            }}
          />
        `}
      </>
    </>
  `
}
