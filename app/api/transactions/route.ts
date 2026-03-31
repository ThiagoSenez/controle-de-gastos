import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') ?? 100)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const where: any = {}
    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1)
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59)
      where.date = { gte: start, lte: end }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true, account: true },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, type, categoryId, accountId, date, description } = body

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        type,
        categoryId,
        accountId,
        date: new Date(date),
        description: description || null,
      },
      include: { category: true, account: true },
    })

    // Update account balance
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          [type === 'INCOME' ? 'increment' : 'decrement']: Number(amount),
        },
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const transaction = await prisma.transaction.findUnique({ where: { id } })
    if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.transaction.delete({ where: { id } })

    // Reverse balance
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          [transaction.type === 'INCOME' ? 'decrement' : 'increment']: transaction.amount,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
}
