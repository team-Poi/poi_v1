const express = require("express");
const { PrismaClient } = require("@prisma/client");
const getWord = require("./wordList/getWord").default;
const prisma = new PrismaClient();
const app = express();

require("dotenv").config();

app.use(express.json());

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

app.post("/n", async (req, res) => {
  if (typeof req.body == "undefined" || typeof req.body.url == "undefined")
    return res.status(402).send({
      e: "Query not found",
    });
  let long = req.body.url;
  let madeBy = ".";
  if (
    !(typeof req.body == "undefined" || typeof req.body.madeBy == "undefined")
  )
    madeBy = req.body.madeBy;

  const already = await prisma.shortURL.findFirst({
    where: {
      long: long,
      madeBy: ".",
    },
  });

  if (!!already && madeBy == ".") return res.send(already.short);

  const getNewShortName = () => {
    return new Promise((resolve, reject) => {
      let short = getWord();
      prisma.shortURL
        .findFirst({
          where: {
            short: short,
          },
        })
        .then(async (v) => {
          if (v) resolve(await getNewShortName());
          else resolve(short);
        })
        .catch(async (e) => {
          console.error(e);
          resolve(await getNewShortName());
        });
    });
  };

  let shortL = await getNewShortName();

  if (madeBy != ".") {
    let gxe = await prisma.shortURL.findFirst({
      where: {
        long: long,
        madeBy: madeBy,
      },
    });
    if (gxe) {
      return res.send(gxe.short);
    } else {
      await prisma.shortURL.create({
        data: {
          long: long,
          short: shortL,
          madeBy: madeBy,
        },
      });
      return res.send(shortL);
    }
  } else {
    await prisma.shortURL.create({
      data: {
        long: long,
        madeBy: madeBy,
        short: shortL,
      },
    });
    res.send(shortL);
  }
});

app.listen(8210, () => {
  console.log("Server listening on port 8210");
});
