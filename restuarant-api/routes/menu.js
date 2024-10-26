var express = require("express");
var router = express.Router();
var config = require("../config/dbconfig");
const sql = require("mssql");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  console.log(config);
  try {
    await sql.connect(config);
    console.log("connected");
    const result =
      await sql.query`SELECT * from tbl_menu`;
    console.log("Query result:", result);
    await sql.close();
    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Database connection error:", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
  }
});

router.get("/getAllMenu", async function (req, res, next) {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .query("SELECT * FROM tbl_menu");
      return res.status(200).json({
        data: result.recordset
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err
      });
    }
  });

router.post("/addMenu", async (req, res) => {
    try {
        const { name , price , description } = req.body;
        let pool = await sql.connect(config);
        const check = await pool.request().query(`SELECT * FROM tbl_menu WHERE name = '${name}'`);
        if(check.recordset.length > 0) {
            return res.status(400).json({data: 'Menu already exists'});
        }
        if(check.recordset.length === 0) {
            let result = await pool.request().query(`INSERT INTO tbl_menu (name, price, description) VALUES ('${name}', ${price}, '${description}')`);
            return res.status(200).json({data: result});
        }
    } catch (error) {
        return res.status(400).json({data: error});
    }
});

router.delete("/deleteMenu/:id", async function (req, res, next) {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM tbl_menu WHERE id = @id");
      return res.status(200).json({
        data: result
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err
      });
    }
  });

router.put("/updateMenu/:id", async function (req, res, next) {
    try {
      const { name , price , description } = req.body;
      const id = req.params.id;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .query(`UPDATE tbl_menu SET name = '${name}' , price = ${price} , description = '${description}' WHERE id = ${id}`);
      return res.status(200).json({
        data: result
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err
      });
    }
  });

router.get("/getMenu/:id", async function (req, res, next) {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("SELECT * FROM tbl_menu WHERE id = @id");
      return res.status(200).json({
        data: result.recordset
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err
      });
    }
});
  


module.exports = router;