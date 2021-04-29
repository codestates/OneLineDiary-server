const express = require("express");
const app = express();
const port = 80;
const cors = require("cors");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(201).send({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
