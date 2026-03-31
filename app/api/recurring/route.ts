import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const recurring = await prisma.recurringTransaction.findMany({
      include: { category: true },
      orderBy: { nextDue: 'asc' },
    })
    return NextResponse.json(recurring)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const item = await prisma.recurringTransaction.create({
      data: {
        name: body.name,
        amount: Number(body.amount),
        frequency: body.frequency,
        nextDue: new Date(body.nextDue),
        categoryId: body.categoryId,
        accountId: body.accountId,
        active: true,
      },
      include: { category: true },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const item = await prisma.recurringTransaction.update({
      where: { id: body.id },
      data: { active: body.active },
      include: { category: true },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.recurringTransaction.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
