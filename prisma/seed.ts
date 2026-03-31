import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Criando categorias padrão...')

  await prisma.recurringTransaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.account.deleteMany()
  await prisma.category.deleteMany()

  // Categorias de despesa
  await prisma.category.createMany({
    data: [
      { name: 'Alimentação',   type: 'EXPENSE', color: '#F59E0B', icon: 'utensils' },
      { name: 'Moradia',       type: 'EXPENSE', color: '#6366F1', icon: 'home' },
      { name: 'Transporte',    type: 'EXPENSE', color: '#3B82F6', icon: 'car' },
      { name: 'Lazer',         type: 'EXPENSE', color: '#EC4899', icon: 'smile' },
      { name: 'Assinaturas',   type: 'EXPENSE', color: '#8B5CF6', icon: 'repeat' },
      { name: 'Saúde',         type: 'EXPENSE', color: '#10B981', icon: 'heart' },
      { name: 'Educação',      type: 'EXPENSE', color: '#F97316', icon: 'book' },
      { name: 'Vestuário',     type: 'EXPENSE', color: '#14B8A6', icon: 'shirt' },
      { name: 'Outros',        type: 'EXPENSE', color: '#6B7280', icon: 'more-horizontal' },
    ],
  })

  // Categorias de receita
  await prisma.category.createMany({
    data: [
      { name: 'Salário',       type: 'INCOME', color: '#34D399', icon: 'trending-up' },
      { name: 'Freelance',     type: 'INCOME', color: '#60A5FA', icon: 'briefcase' },
      { name: 'Investimentos', type: 'INCOME', color: '#A78BFA', icon: 'bar-chart' },
      { name: 'Outros',        type: 'INCOME', color: '#6B7280', icon: 'plus-circle' },
    ],
  })

  console.log('✅ Categorias criadas! Agora adicione suas contas e transações no app.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
