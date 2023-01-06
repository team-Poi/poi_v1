import express from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

const prisma = new PrismaClient();
const app = express();

app.use((req, res, next) => {
  let sec = req.query.sec;
  if (decodeURI(sec).trim() != decodeURI(process.env.SECRET.trim()))
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
  else next();
});

app.get("/s/:id", (req, res) => {
  let id = req.params.id;
  prisma.shortURL
    .findFirst({
      where: {
        short: id,
      },
    })
    .then((v) => {
      if (v) res.status(301).redirect(v.long);
      else res.status(301).redirect("https://poi.kr/404");
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
});

dotenv.config();
app.listen(8210, () => {
  console.log("Server listening on port 8210");
});
