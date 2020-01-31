//RENDERS FRONTEND

const path = require("path");
const express = require("express");

const router = express.Router();

router.use(express.static(path.join(__dirname, "UI")));

router.get("/", (req, res) => {
  res.sendFile("index.html");
})

//serviceWorker.unregister

module.exports = router;