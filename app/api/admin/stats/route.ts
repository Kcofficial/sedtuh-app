import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total counts
    const [
      totalUsers,
      totalDrivers,
      totalMitra,
      totalOrders,
      activeOrders,
      completedOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.driverProfile.count(),
      prisma.mitraProfile.count(),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: {
            in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'PICKING_UP', 'ON_THE_WAY']
          }
        }
      }),
      prisma.order.count({
        where: { status: 'COMPLETED' }
      })
    ])

    // Calculate total revenue from completed orders
    const revenueResult = await prisma.order.aggregate({
      where: { 
        status: 'COMPLETED',
        paymentStatus: 'PAID'
      },
      _sum: {
        totalPrice: true
      }
    })

    const totalRevenue = revenueResult._sum.totalPrice || 0

    const stats = {
      totalUsers,
      totalDrivers,
      totalMitra,
      totalOrders,
      activeOrders,
      completedOrders,
      totalRevenue
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
