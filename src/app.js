/* global Pear */

import { html } from 'htm/react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './context/user'
import { PeersProvider } from './context/peers'
import App from './containers/App'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const { app } = await Pear.versions()
const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const root = createRoot(document.querySelector('#root'))
root.render(html`
  <${ThemeProvider} theme=${theme}>
    <${CssBaseline} />
    <${UserProvider} config=${Pear.config}>
      <${PeersProvider}
        name="filesharing-app-example"
        topic=${app.key || '57337a386673415371314f315a6d386f504576774259624e32446a7377393752'}
      >
        <${App}
          app={app}
        />
      </>
    </>
  </>
`)
