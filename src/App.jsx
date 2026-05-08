import { useState } from 'react'
import IdentificationPage from './Pages/IdentificationPage.jsx'
import AccueilPage from './Pages/AccueilPage.jsx'

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null)

  if (!authenticatedUser) {
    return <IdentificationPage onAuthenticated={setAuthenticatedUser} />
  }

  return (
    <AccueilPage
      user={authenticatedUser}
      onLogout={() => setAuthenticatedUser(null)}
    />
  )
}

export default App

