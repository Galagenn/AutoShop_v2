import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const userPasswordHash = await bcrypt.hash('user12345', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@autoshop.local' },
    update: {},
    create: {
      email: 'admin@autoshop.local',
      name: 'Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@autoshop.local' },
    update: {},
    create: {
      email: 'user@autoshop.local',
      name: 'User',
      passwordHash: userPasswordHash,
      role: Role.BUYER,
    },
  })

  const carsData = [
    {
      brand: 'BMW',
      model: 'M4',
      year: 2022,
      mileage: 8000,
      price: 78000,
      description: 'BMW M4 Coupe in excellent condition',
      images: ['/bmw-m-series-m4-coupe-modelfinder 1.png'],
      ownerId: admin.id,
    },
    {
      brand: 'Audi',
      model: 'A6',
      year: 2020,
      mileage: 25000,
      price: 32000,
      description: 'Audi A6 with great features',
      images: ['/f23f9915b06267a38f4315f8bf8fde9d023a8a5d.png'],
      ownerId: user.id,
    },
  ]

  for (const car of carsData) {
    await prisma.car.create({ data: car })
  }

  await prisma.message.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test message',
      message: 'Interested in BMW M4, please contact me.',
    },
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
