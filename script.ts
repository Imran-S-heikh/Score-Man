import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const club = await prisma.club.findUnique({
    where: { name: 'Salim Cricket Academy' },
  });

  if (!club) {
    return console.log('No Slub Found');
  }

  const imran = await prisma.player.findUnique({
    where: { email: 'imransheikhsadi@gmail.com' },
  });
  const dipu = await prisma.player.findUnique({
    where: { email: 'dipuudayput@gmail.com' },
  });
  const billal = await prisma.player.findUnique({
    where: { email: 'billalislam@gmail.com' },
  });
  const munna = await prisma.player.findUnique({
    where: { email: 'munnasheikh@gmail.com' },
  });

  if (!imran || !dipu || !billal || !munna) {
    return console.log('Not all Players found');
  }

  const match = await prisma.match.create({
    data: {
      clubId: club.id,
    },
  });

  const temaOne = await prisma.team.create({
    data: {
      clubId: club.id,
      players: { connect: [{ id: imran.id }, { id: dipu.id }] },
      matches: { connect: [{ id: match.id }] },
    },
  });

  const teamTwo = await prisma.team.create({
    data: {
      clubId: club.id,
      players: { connect: [{ id: billal.id }, { id: munna.id }] },
      matches: { connect: [{ id: match.id }] },
    },
  });

  const firstInnings = await prisma.innings.create({
    data: {
      matchId: match.id,
      inningsType: 'FIRST',
    },
  });

  const fristBallByImran = await prisma.ball.create({
    data: {
      bowledTime: new Date(),
      ballType: 'LEGAL',
      batterId: munna.id,
      bowlerId: imran.id,
      inningsId: firstInnings.id,
      dismissalType: 'NONE',
      scoreType: 'REGULAR',
      runs: 4,
      extra: 0,
    },
  });
}

main();
