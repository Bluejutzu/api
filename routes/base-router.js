const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/tickets", require("./tickets"));
router.use("/dashboard", require("./dashboard"));
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
