import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@shop.com',
    role: 'Store Manager',
  })

  const login = () => {
    setUser({
      name: 'Admin User',
      email: 'admin@shop.com',
      role: 'Store Manager',
    })
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
