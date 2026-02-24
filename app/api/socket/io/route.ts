import { NextRequest, NextResponse } from 'next/server'
import SocketHandler from '@/lib/socket'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Socket endpoint' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Socket endpoint' })
}
