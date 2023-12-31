import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  const params = req.nextUrl.searchParams;
  const id = params.get("id");

  if (!id) {
    return new Response("Missing ID", {
      status: 400,
    });
  }

  const hasMatchEnd = await prisma.matchEnd.findFirst({
    where: {
      scrimId: parseInt(id),
    },
  });

  const hasPayloadProgress = await prisma.payloadProgress.findFirst({
    where: {
      scrimId: parseInt(id),
    },
  });

  const hasPointProgress = await prisma.pointProgress.findFirst({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.scrim.delete({
    where: {
      id: parseInt(id),
    },
  });

  await prisma.map.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.mapData.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.defensiveAssist.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.heroSpawn.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.heroSwap.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.kill.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  if (hasMatchEnd) {
    await prisma.matchEnd.deleteMany({
      where: {
        scrimId: parseInt(id),
      },
    });
  }

  await prisma.matchStart.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.offensiveAssist.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.objectiveCaptured.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.objectiveUpdated.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  if (hasPayloadProgress) {
    await prisma.payloadProgress.deleteMany({
      where: {
        scrimId: parseInt(id),
      },
    });
  }

  await prisma.playerStat.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  if (hasPointProgress) {
    await prisma.pointProgress.deleteMany({
      where: {
        scrimId: parseInt(id),
      },
    });
  }

  await prisma.roundEnd.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.roundStart.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.setupComplete.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.ultimateCharged.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.ultimateEnd.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  await prisma.ultimateStart.deleteMany({
    where: {
      scrimId: parseInt(id),
    },
  });

  return new Response("OK", {
    status: 200,
  });
}
