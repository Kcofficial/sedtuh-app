'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      path: '/api/socket/io',
      addTrailingSlash: false
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  return { emit, on, off }
}
