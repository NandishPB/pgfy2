import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('pgfy_token')
    const savedUser = localStorage.getItem('pgfy_user')
    if (saved) {
      setToken(saved)
      api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
    }
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const signin = async (email, password) => {
    const res = await api.post('/auth/signin', { email, password })
    const { token, user } = res.data
    setToken(token)
    setUser(user)
    localStorage.setItem('pgfy_token', token)
    localStorage.setItem('pgfy_user', JSON.stringify(user))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return user
  }

  const signup = async (payload) => {
    const res = await api.post('/auth/signup', payload)
    return res.data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('pgfy_token')
    localStorage.removeItem('pgfy_user')
    delete api.defaults.headers.common['Authorization']
  }

  const updateUser = (u) => {
    setUser(u)
    if (u) localStorage.setItem('pgfy_user', JSON.stringify(u))
    else localStorage.removeItem('pgfy_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, signin, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
