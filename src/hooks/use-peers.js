import { useContext } from 'react'
import { PeersContext } from '../context/peers'

export default () => {
  const context = useContext(PeersContext)
  if (context === undefined) {
    throw new Error('usePeers must be used within a PeersProvider')
  }

  return context
}
