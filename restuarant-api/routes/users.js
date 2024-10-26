var express = require("express");
var router = express.Router();
var config = require("../config/dbconfig");
const sql = require("mssql");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  console.log(config.user);
  try {
    await sql.connect(config);
    console.log("connected");
    const result =
      await sql.query`SELECT * from tbl_admin`;
    console.log("Query result:", result);
    await sql.close();
    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Database connection error:", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
  }
});

router.post("/login-fixed", function (req, res, next) {
  if (req.body.username === "test@x.com" && req.body.password === "1234") {
    return res.status(200).json({ data: "login success" });
  } else {
    return res.status(200).json({ data: "login failed" });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("username", sql.VarChar, req.body.username)
      .input("password", sql.VarChar, req.body.password)
      .query(
        "SELECT * FROM tbl_admin WHERE email = @username AND password = @password"
      );
    return res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ data: err });
  }
});

module.exports = router;
