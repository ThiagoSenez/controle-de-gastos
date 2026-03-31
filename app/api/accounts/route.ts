import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const account = await prisma.account.create({
      data: {
        name: body.name,
        type: body.type,
        balance: Number(body.balance ?? 0),
        color: body.color ?? '#F59E0B',
        icon: body.icon ?? 'wallet',
      },
    })
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
