const express = require("express");
const mongoose = require("mongoose");

const rootRouter = require("./src/routers/rootRouter");
const mongoCred = require("./src/config/mongo_cred");

const app = express();

app.use(express.json());

mongoose.connect(mongoCred.url).then((data) => {
  console.log("data base Connected!");
});

app.get("/", (req, res, next) => {
  res.send({
    success: true,
    message: "hi i am in running Phase!",
  });
});
app.use("/api/2023", rootRouter);

const PORT = 80;
app.listen(PORT, (err, data) => {
  if (err) return;
  console.log("Server listion on PORT ", PORT);
});
