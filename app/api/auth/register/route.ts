import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Semua field harus diisi!' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['USER', 'DRIVER', 'MITRA'].includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid!' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar!' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // For DRIVER and MITRA, create with PENDING status
    // For USER, create with ACTIVE status (auto-approved)
    const isApproved = role === 'USER'
    const userStatus = isApproved ? 'ACTIVE' : 'PENDING'

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isOnline: false, // All users start offline
        isActive: isApproved,
        status: userStatus
      }
    })

    // Create role-specific profile if needed
    if (role === 'DRIVER') {
      await prisma.driverProfile.create({
        data: {
          userId: user.id,
          vehicleType: 'MOTORCYCLE',
          vehiclePlate: 'TEMP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          isAvailable: false, // Not available until approved
          licenseNumber: 'PENDING',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          rating: 0
        }
      })
    } else if (role === 'MITRA') {
      await prisma.mitraProfile.create({
        data: {
          userId: user.id,
          shopName: `${name}'s Shop`,
          shopAddress: 'To be updated',
          shopPhone: 'To be updated',
          businessLicense: 'PENDING',
          isVerified: false
        }
      })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    // Different response based on role
    if (role === 'USER') {
      return NextResponse.json({
        message: 'Akun User berhasil dibuat! Silakan login.',
        user: userWithoutPassword,
        requiresApproval: false
      })
    } else {
      return NextResponse.json({
        message: `Pendaftaran ${role} berhasil! Akun Anda sedang menunggu persetujuan admin. Silakan tunggu konfirmasi via email.`,
        user: userWithoutPassword,
        requiresApproval: true,
        status: 'PENDING'
      })
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server, coba lagi!' },
      { status: 500 }
    )
  }
}
