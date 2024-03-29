import { auth, getImpersonateUrl } from "@/lib/auth";
import { $Enums } from "@prisma/client";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/data/user-dto";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUser(session.user.email);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (user.role !== $Enums.UserRole.ADMIN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as { email: string; isProd: boolean };

  const url = await getImpersonateUrl(body.email, body.isProd);

  return new Response(JSON.stringify({ url }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
