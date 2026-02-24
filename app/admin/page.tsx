'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Car, ShoppingCart, DollarSign, TrendingUp, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalMitra: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchAdminData()
    }
  }, [session])

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch recent orders
      const ordersResponse = await fetch('/api/admin/orders?limit=10')
      const ordersData = await ordersResponse.json()
      setRecentOrders(ordersData)

      // Fetch recent users
      const usersResponse = await fetch('/api/admin/users?limit=10')
      const usersData = await usersResponse.json()
      setRecentUsers(usersData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Car className="h-8 w-8 text-green-600" />
              <CardTitle className="text-lg">Total Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalDrivers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-lg">Total Mitra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalMitra}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Activity className="h-8 w-8 text-orange-600" />
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <CardTitle className="text-lg">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeOrders}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/orders')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent orders</p>
                  </div>
                ) : (
                  recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.user?.name} • ${order.totalPrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Recent Users</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent users</p>
                  </div>
                ) : (
                  recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'DRIVER' ? 'bg-green-100 text-green-800' :
                          user.role === 'MITRA' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="h-6 w-6" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/drivers')}
              >
                <Car className="h-6 w-6" />
                Manage Drivers
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/mitra')}
              >
                <ShoppingCart className="h-6 w-6" />
                Manage Mitra
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/orders')}
              >
                <Activity className="h-6 w-6" />
                Manage Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
