const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const mainController = require("./controller");
const app = express();
const port = 4000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors 처리
app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

// app.get("/mypage/userinfo", mainController.mypageController);

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
