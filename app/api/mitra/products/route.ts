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
    const mitraId = searchParams.get('mitraId')
    const category = searchParams.get('category')

    const where: any = {}
    
    if (mitraId) {
      where.mitraId = mitraId
    } else if (session.user.role === 'MITRA') {
      where.mitraId = session.user.id
    }

    if (category) {
      where.category = category
    }

    const products = await prisma.product.findMany({
      where,
      include: {
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'MITRA') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      category,
      image
    } = body

    // Check if mitra profile exists
    const mitraProfile = await prisma.mitraProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!mitraProfile) {
      return NextResponse.json({ error: 'Mitra profile not found' }, { status: 404 })
    }

    const product = await prisma.product.create({
      data: {
        mitraId: session.user.id,
        name,
        description,
        price,
        category,
        image
      },
      include: {
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
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
