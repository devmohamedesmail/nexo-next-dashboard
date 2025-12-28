'use client'

import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { config } from '@/constants/config'
import { getErrorMessage } from '@/helper/get-error'

interface User {
  id: number
  name: string
  identifier: string
}

interface AuthContextType {
  user: User | null
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, identifier: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (identifier: string, password: string) => {
    try {
      const res = await axios.post(`${config.API_URL}/auth/login`, { identifier, password })
      const userData = res.data.user
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return { 
        success: true,
        user:userData
      }
    } catch (error) {
      return { success: false, message: getErrorMessage(error) }
    }
  }

  const register = async (name: string, identifier: string, password: string) => {
    try {
      const res = await axios.post(`${config.API_URL}/auth/register`, {
        name,
        identifier,
        password
      })
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return { success: true }
    } catch (error) {
      return { success: false, message: getErrorMessage(error) }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
