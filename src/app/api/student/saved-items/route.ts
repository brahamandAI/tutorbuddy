import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const allowedTypes = new Set(['course', 'learning'])

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateUser(request)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const type = request.nextUrl.searchParams.get('type')
  if (type && !allowedTypes.has(type)) {
    return NextResponse.json({ error: 'Invalid saved item type' }, { status: 400 })
  }

  const items = await prisma.savedItem.findMany({
    where: { userId: user.id, ...(type ? { type } : {}) },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const { user, error } = await authenticateUser(request)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { type, resourceId, title, subtitle, href, metadata } = body
  if (!allowedTypes.has(type) || !resourceId || !title || !href) {
    return NextResponse.json({ error: 'type, resourceId, title and href are required' }, { status: 400 })
  }

  const item = await prisma.savedItem.upsert({
    where: { userId_type_resourceId: { userId: user.id, type, resourceId } },
    create: { userId: user.id, type, resourceId, title, subtitle, href, metadata },
    update: { title, subtitle, href, metadata },
  })
  return NextResponse.json(item)
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await authenticateUser(request)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const type = request.nextUrl.searchParams.get('type')
  const resourceId = request.nextUrl.searchParams.get('resourceId')
  if (!type || !resourceId) {
    return NextResponse.json({ error: 'type and resourceId are required' }, { status: 400 })
  }

  await prisma.savedItem.deleteMany({ where: { userId: user.id, type, resourceId } })
  return NextResponse.json({ success: true })
}
