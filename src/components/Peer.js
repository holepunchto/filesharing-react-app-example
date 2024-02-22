import { html } from 'htm/react'
import usePeer from '../hooks/use-peer'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilesList from './FilesList'

export default ({ hyperdrive }) => {
  const { profile, files } = usePeer({ hyperdrive })

  return html`
    <${Accordion}>
      <${AccordionSummary} aria-controls="peer-content" expandIcon=${html`<${ExpandMoreIcon} />`}>
        <${Typography}>
          ${profile?.name}
        </>
      </>
      <${AccordionDetails}>
        <${FilesList}
          hyperdrive=${hyperdrive}
          files=${files}
        />
      </>
    </>
  `
}
