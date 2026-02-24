import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (session.user.role === 'USER') {
      where.userId = session.user.id
    } else if (session.user.role === 'DRIVER') {
      where.driverId = session.user.id
    } else if (session.user.role === 'MITRA') {
      where.mitraId = session.user.id
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      pickupAddress,
      deliveryAddress,
      items,
      totalPrice,
      deliveryFee,
      paymentMethod
    } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        type,
        pickupAddress,
        deliveryAddress,
        totalPrice,
        deliveryFee,
        paymentMethod,
        status: 'PENDING',
        items: items ? {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        } : undefined
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    // TODO: Send notification to available drivers
    // TODO: Send notification to mitra if it's a food order

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
