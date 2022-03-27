import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { shortId } = req.query;

    if (!shortId) {
      res.status(403).json({ message: "Invalid request" });
    } else {
      const prisma = new PrismaClient();

      const shortIdEntry = await prisma.redirect.findUnique({
        where: {
          id: shortId as string,
        },
      });

      if (!shortIdEntry) {
        res.status(404).json({ message: "Entry not found" });
      } else {
        res.status(200).json({ ...shortIdEntry });
      }
    }
  }
}
