'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingCart, DollarSign, Package, Clock, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MitraDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayOrders: 0,
    totalProducts: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const productsResponse = await fetch('/api/mitra/products')
      const productsData = await productsResponse.json()
      setProducts(productsData)

      // Fetch orders
      const ordersResponse = await fetch('/api/orders?status=PENDING,PREPARING,READY')
      const ordersData = await ordersResponse.json()
      setOrders(ordersData)

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0)
      const todayOrders = ordersData.filter((order: any) => {
        const orderDate = new Date(order.createdAt)
        const today = new Date()
        return orderDate.toDateString() === today.toDateString()
      }).length

      setStats({
        totalRevenue,
        todayOrders,
        totalProducts: productsData.length,
        pendingOrders: ordersData.filter((order: any) => order.status === 'PENDING').length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success(`Order status updated to ${newStatus}`)
        fetchDashboardData()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mitra Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your shop and orders</p>
          </div>
          
          <Button onClick={() => router.push('/mitra/products/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-lg">Today's Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.todayOrders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Package className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-lg">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <CardTitle className="text-lg">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent orders</p>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">Total: ${order.totalPrice}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'READY' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateOrderStatus(order.id, 'READY')}
                          >
                            Mark Ready
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/mitra/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No products yet</p>
                    <Button onClick={() => router.push('/mitra/products/new')}>
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  products.slice(0, 5).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">${product.price}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/mitra/products/${product.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
