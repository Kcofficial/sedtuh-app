import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { latitude, longitude } = body

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
    }

    // Update driver's current location in profile
    await prisma.driverProfile.update({
      where: { userId: session.user.id },
      data: {
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        }
      }
    })

    // Store location history
    const location = await prisma.driverLocation.create({
      data: {
        driverId: session.user.id,
        latitude,
        longitude
      }
    })

    // TODO: Emit real-time location update via Socket.io

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Error updating driver location:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')

    if (!driverId) {
      return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 })
    }

    const locations = await prisma.driverLocation.findMany({
      where: { driverId },
      orderBy: { timestamp: 'desc' },
      take: 10 // Get last 10 locations
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching driver locations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
