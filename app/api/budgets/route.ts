import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const month = Number(searchParams.get('month') ?? new Date().getMonth() + 1)
    const year = Number(searchParams.get('year') ?? new Date().getFullYear())
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)

    const budgets = await prisma.budget.findMany({
      where: { month, year },
      include: { category: true },
    })

    const spent = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { type: 'EXPENSE', date: { gte: start, lte: end } },
      _sum: { amount: true },
    })

    const result = budgets.map((b) => ({
      ...b,
      spent: spent.find((s) => s.categoryId === b.categoryId)?._sum.amount ?? 0,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const budget = await prisma.budget.upsert({
      where: {
        categoryId_month_year: {
          categoryId: body.categoryId,
          month: Number(body.month),
          year: Number(body.year),
        },
      },
      update: { limit: Number(body.limit) },
      create: {
        categoryId: body.categoryId,
        limit: Number(body.limit),
        month: Number(body.month),
        year: Number(body.year),
      },
      include: { category: true },
    })
    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
  }
}
