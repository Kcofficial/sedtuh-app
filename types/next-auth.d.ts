import { DefaultSession } from 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      isActive: boolean
      status: string
      isOnline: boolean
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
    isActive: boolean
    status: string
    isOnline: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    isActive: boolean
    status: string
    isOnline: boolean
  }
}
