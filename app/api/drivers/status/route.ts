import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isOnline } = body

    // Update user's online status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isOnline }
    })

    // Update driver's availability
    await prisma.driverProfile.update({
      where: { userId: session.user.id },
      data: { isAvailable: isOnline }
    })

    return NextResponse.json({ message: 'Status updated successfully' })
  } catch (error) {
    console.error('Error updating driver status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
