"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

  let db = null;

  const MongoClient = require("mongodb").MongoClient;
  const MONGODB_URI = "mongodb://localhost:27017/tweeter";

  //Handler to connect with mongoDB and loading resources
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw err;
    }
    const DataHelpers = require("./lib/data-helpers.js")(db);
    const tweetsRoutes = require("./routes/tweets")(DataHelpers);
    app.use("/tweets", tweetsRoutes);

    app.listen(PORT, () => {
      console.log("Example app listening on port " + PORT);
    });
  });