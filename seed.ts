import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const club = await prisma.club.create({
    data: {
      name: 'Salim Cricket Academy',
    },
  });

  const imran = await prisma.player.create({
    data: {
      email: 'imransheikhsadi@gmail.com',
      name: 'Imran Shaikh',
      phone: '01824182649',
      clubId: club.id,
    },
  });
  const dipu = await prisma.player.create({
    data: {
      email: 'dipuudayput@gmail.com',
      name: 'Dipu Islam Raj',
      phone: '019348457848',
      clubId: club.id,
    },
  });
  const billal = await prisma.player.create({
    data: {
      email: 'billalislam@gmail.com',
      name: 'Billal',
      phone: '018349897493',
      clubId: club.id,
    },
  });
  const munna = await prisma.player.create({
    data: {
      email: 'munnasheikh@gmail.com',
      name: 'Munna Shaikh',
      phone: '01846447883',
      clubId: club.id,
    },
  });
}

main();
