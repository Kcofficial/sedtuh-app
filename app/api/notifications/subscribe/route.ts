import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { token, platform } = body

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Check if token already exists
    const existingToken = await prisma.pushToken.findFirst({
      where: {
        token,
        userId: session.user.id
      }
    })

    if (existingToken) {
      return NextResponse.json({ message: 'Token already registered' })
    }

    // Register new push token
    const pushToken = await prisma.pushToken.create({
      data: {
        userId: session.user.id,
        token,
        platform: platform || 'web'
      }
    })

    return NextResponse.json({ message: 'Push token registered successfully', pushToken })
  } catch (error) {
    console.error('Error registering push token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Remove push token
    await prisma.pushToken.deleteMany({
      where: {
        token,
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: 'Push token unregistered successfully' })
  } catch (error) {
    console.error('Error unregistering push token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
