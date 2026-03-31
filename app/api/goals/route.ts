import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(goals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const goal = await prisma.goal.create({
      data: {
        name: body.name,
        targetAmount: Number(body.targetAmount),
        currentAmount: Number(body.currentAmount ?? 0),
        color: body.color ?? '#F59E0B',
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
      },
    })
    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const goal = await prisma.goal.update({
      where: { id: body.id },
      data: { currentAmount: Number(body.currentAmount) },
    })
    return NextResponse.json(goal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.goal.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
