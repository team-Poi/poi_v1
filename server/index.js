import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();

app.get("/s/:id", (req, res) => {
  let id = req.params.id;
  prisma.shortURL
    .findUnique({
      where: {
        short: id,
      },
    })
    .then((v) => {
      if (v) res.status(301).redirect(v.long);
      else res.status(301).redirect("https://poi.kr/404");
    });
});

app.listen(8210, () => {
  console.log("Server listening on port 8210");
});
