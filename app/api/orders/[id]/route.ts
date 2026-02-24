import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        },
        mitra: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user has permission to view this order
    if (
      order.userId !== session.user.id &&
      order.driverId !== session.user.id &&
      order.mitraId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, driverId, paymentStatus } = body

    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check permissions
    const canUpdate = 
      (session.user.role === 'DRIVER' && order.driverId === session.user.id) ||
      (session.user.role === 'MITRA' && order.mitraId === session.user.id) ||
      (session.user.role === 'ADMIN') ||
      (session.user.role === 'USER' && order.userId === session.user.id && status === 'CANCELLED')

    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (driverId) updateData.driverId = driverId
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: true,
        driver: {
          include: {
            user: true
          }
        },
        mitra: {
          include: {
            user: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // TODO: Send real-time notifications via Socket.io
    // TODO: Send push notifications

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
