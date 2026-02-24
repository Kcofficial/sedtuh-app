import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@sendtuh.com' }
    })

    if (existingAdmin) {
      console.log('Admin account already exists')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@sendtuh.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        status: 'ACTIVE',
        isOnline: false
      }
    })

    console.log('Admin account created successfully:', admin.email)
    console.log('Email: admin@sendtuh.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
