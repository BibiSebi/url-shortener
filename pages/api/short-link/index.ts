import type { NextApiRequest, NextApiResponse } from "next";
import sha256 from "crypto-js/sha256";
import base62 from "crypto-js/enc-base64";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  async function main() {
    // Connect the client
    await prisma.$connect();
    // ... you will write your Prisma Client queries here
  }

  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  if (req.method === "POST") {
    const shaEncoded = sha256(req.body.link);
    const base62Converted = base62.stringify(shaEncoded);

    await prisma.redirect.create({
      data: {
        id: base62Converted.substring(0, 7),
        longURL: req.body.link,
        clicks: 1,
      },
    });

    console.log("prisma data", await prisma.redirect.findMany());
    res.status(200).json({ message: base62Converted.substring(0, 7) });
  } else {
    res.status(500).json({ message: "You fudged up!" });
  }
}
