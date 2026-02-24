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
    const available = searchParams.get('available')
    const vehicleType = searchParams.get('vehicleType')

    const where: any = {}
    
    if (available === 'true') {
      where.isAvailable = true
      where.user = {
        isOnline: true
      }
    }

    if (vehicleType) {
      where.vehicleType = vehicleType
    }

    const drivers = await prisma.driverProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            isOnline: true
          }
        },
        driverLocations: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      }
    })

    return NextResponse.json(drivers)
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      licenseNumber,
      vehicleType,
      vehiclePlate
    } = body

    // Check if driver profile already exists
    const existingProfile = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile) {
      return NextResponse.json({ error: 'Driver profile already exists' }, { status: 400 })
    }

    const driverProfile = await prisma.driverProfile.create({
      data: {
        userId: session.user.id,
        licenseNumber,
        vehicleType,
        vehiclePlate
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(driverProfile, { status: 201 })
  } catch (error) {
    console.error('Error creating driver profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
