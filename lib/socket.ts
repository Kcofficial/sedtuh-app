import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Driver joins their room
      socket.on('driver-join', (driverId: string) => {
        socket.join(`driver-${driverId}`)
        console.log(`Driver ${driverId} joined their room`)
      })

      // User joins their room
      socket.on('user-join', (userId: string) => {
        socket.join(`user-${userId}`)
        console.log(`User ${userId} joined their room`)
      })

      // Driver location updates
      socket.on('driver-location', (data: { driverId: string, location: { lat: number, lng: number } }) => {
        socket.broadcast.emit(`location-${data.driverId}`, data.location)
        // Also send to specific user if they're tracking this driver
        socket.to(`tracking-${data.driverId}`).emit('driver-location-update', data)
      })

      // User starts tracking driver
      socket.on('track-driver', (data: { userId: string, driverId: string }) => {
        socket.join(`tracking-${data.driverId}`)
        console.log(`User ${data.userId} is tracking driver ${data.driverId}`)
      })

      // User stops tracking driver
      socket.on('stop-tracking', (data: { userId: string, driverId: string }) => {
        socket.leave(`tracking-${data.driverId}`)
        console.log(`User ${data.userId} stopped tracking driver ${data.driverId}`)
      })

      // New order notification
      socket.on('new-order', (orderData: { driverId: string, order: any }) => {
        io.to(`driver-${orderData.driverId}`).emit('order-notification', orderData.order)
      })

      // Order status updates
      socket.on('order-status', (data: { userId: string, status: string, order: any }) => {
        io.to(`user-${data.userId}`).emit('order-status-update', {
          status: data.status,
          order: data.order
        })
      })

      // Driver availability toggle
      socket.on('driver-availability', (data: { driverId: string, isAvailable: boolean }) => {
        socket.broadcast.emit('driver-availability-update', {
          driverId: data.driverId,
          isAvailable: data.isAvailable
        })
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  res.end()
}

export default SocketHandler
