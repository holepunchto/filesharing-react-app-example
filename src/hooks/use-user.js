import { useContext } from 'react'
import { UserContext } from '../context/user'

export default () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
