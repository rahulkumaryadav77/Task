const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const Coin = require("./models/coin");

mongoose.connect("mongodb://localhost:27017/task", {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    setInterval(async() => {
      const coin = await axios.get("https://api.wazirx.com/api/v2/tickers");
  
      let coinArr = [], newCoin;
      Object.keys(coin.data).forEach((key) => coinArr.push(coin.data[key]));
      coinArr = coinArr.slice(0, 10);
      for (let coin of coinArr) {
        newCoin = new Coin({
          name: coin.name,
          high: coin.high,
          low: coin.low,
          last: coin.last,
          buy: coin.buy,
          sell: coin.sell,
        });
        await newCoin.save();
      }
    }, 60000);
    // res.send({ message: "Successful" });
    const coins = await Coin.aggregate([{ $sort: { _id: -1 } }, { $limit: 10 }]);
    const average = await Coin.aggregate([{ $match : { name : "BTC/INR" } }, { $sort: { _id: -1 } }, { $limit: 5 }]);
    // console.log(average);
    res.render('home', { coins, average });

  } catch (err) {
    console.log("error", err);
  }
});

app.get("/getTickers", async (req, res) => {
  try {
    const coins = await Coin.aggregate([{ $sort: { _id: -1 } }, { $limit: 10 }]);
    res.send(coins);
  } catch(e) {
    console.log("error", err);
  }
});

app.listen(4000, () => {
  console.log(" App islistning on port 4000");
});
