'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp,
  User,
  Settings,
  LogOut,
  Bell,
  CheckCircle,
  XCircle,
  Navigation
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DriverDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [earnings, setEarnings] = useState(150000)
  const [trips, setTrips] = useState(12)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'DRIVER') {
      router.push('/')
      return
    }

    // Check if user is approved
    if (!session.user.isActive || session.user.status === 'PENDING') {
      toast.error('Akun Anda belum disetujui oleh admin. Silakan tunggu konfirmasi.')
      router.push('/auth/signin')
      return
    }

    // Simulate receiving order
    const timer = setTimeout(() => {
      setCurrentOrder({
        id: '1',
        customerName: 'John Doe',
        pickup: 'Jl. Sudirman No. 123',
        destination: 'Jl. Gatot Subroto No. 456',
        fare: 25000,
        distance: '3.2 km',
        estimatedTime: '15 min'
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [session, router])

  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline
    setIsOnline(newStatus)

    try {
      await fetch('/api/drivers/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOnline: newStatus })
      })

      toast.success(newStatus ? 'Anda sekarang online' : 'Anda sekarang offline')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Gagal memperbarui status')
      setIsOnline(!newStatus) // Revert on error
    }
  }

  const handleAcceptOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${currentOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ACCEPTED',
          driverId: session?.user?.id
        })
      })

      if (response.ok) {
        toast.success('Order diterima!')
        setCurrentOrder(null)
        router.push(`/driver/orders/${currentOrder.id}`)
      }
    } catch (error) {
      toast.error('Gagal menerima order')
    }
  }

  const handleRejectOrder = () => {
    setCurrentOrder(null)
    toast('Order ditolak')
  }

  const handleSignOut = async () => {
    await router.push('/auth/signout')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Driver Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/driver/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/driver/settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Toggle */}
        <div className="mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Status Anda</h2>
                  <p className="text-gray-400">
                    {isOnline ? 'Anda sedang online dan menerima order' : 'Anda sedang offline'}
                  </p>
                </div>
                <Button
                  onClick={toggleOnlineStatus}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isOnline
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Pendapatan</p>
                  <p className="text-2xl font-bold">Rp {earnings.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-600 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Trip</p>
                  <p className="text-2xl font-bold">{trips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-600 rounded-lg">
                  <Star className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Online Time</p>
                  <p className="text-2xl font-bold">2h 30m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Order */}
        {currentOrder && (
          <div className="mb-8">
            <Card className="bg-gray-800 border-gray-700 border-2 border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-yellow-500" />
                  Order Baru!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Pickup</p>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-green-500" />
                      <span>{currentOrder.pickup}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Destination</p>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-red-500" />
                      <span>{currentOrder.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Distance</p>
                    <p className="font-semibold">{currentOrder.distance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Est. Time</p>
                    <p className="font-semibold">{currentOrder.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Fare</p>
                    <p className="font-semibold text-green-500">Rp {currentOrder.fare.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAcceptOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terima
                  </Button>
                  <Button
                    onClick={handleRejectOrder}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-600 rounded-lg mr-4">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Trip #{item}</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-500">Rp 25.000</p>
                    <p className="text-sm text-gray-400">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
