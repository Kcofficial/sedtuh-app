'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ShoppingCart, Car, Clock } from 'lucide-react'
import { useSocket } from '@/lib/useSocket'
import toast from 'react-hot-toast'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { emit, on } = useSocket()
  const [activeOrders, setActiveOrders] = useState([])
  const [nearbyDrivers, setNearbyDrivers] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      emit('user-join', session.user.id)
      
      // Listen for order status updates
      on('order-status-update', (data) => {
        toast.success(`Order status: ${data.status}`)
        // Refresh orders
      })
    }
  }, [session, emit, on])

  const handleBookOjek = () => {
    router.push('/dashboard/ojek')
  }

  const handleOrderFood = () => {
    router.push('/dashboard/food')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">What would you like to do today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleBookOjek}>
            <CardHeader className="pb-3">
              <Car className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-lg">Book Ojek</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Get a ride anywhere</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleOrderFood}>
            <CardHeader className="pb-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <CardTitle className="text-lg">Order Food</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Food delivery</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-lg">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">View past orders</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <MapPin className="h-8 w-8 text-red-600" />
              <CardTitle className="text-lg">Saved Places</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Manage addresses</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Orders</h2>
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No active orders</p>
                <Button className="mt-4" onClick={handleBookOjek}>
                  Book a Ride
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Status:</strong> {order.status}</p>
                      <p className="text-sm"><strong>Type:</strong> {order.type}</p>
                      <p className="text-sm"><strong>Total:</strong> ${order.totalPrice}</p>
                      <Button size="sm" className="w-full">
                        Track Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
