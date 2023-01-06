import express from "express";

const app = express();

app.get("/s/:id", (req, res) => {
  let id = req.params.id;
  let url = "https://google.com"; // TODO : Get from db
  res.status(301).redirect("https://google.com");
});

app.listen(8210, () => {
  console.log("Server listening on port 8210");
});
