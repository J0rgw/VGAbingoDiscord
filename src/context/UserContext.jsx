import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const USERS = ['Jorge', 'Aaron', 'Nesus', 'Paco', 'Sufian', 'Miguel', 'Isaac', 'Manuel']

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('vga-user') || null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vga-user', currentUser)
    } else {
      localStorage.removeItem('vga-user')
    }
  }, [currentUser])

  const logout = () => setCurrentUser(null)

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout, USERS }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
