var express = require("express");
var router = express.Router();
var config = require("../config/dbconfig");
const sql = require("mssql");

/* GET reservation listing. */
/**
 * @swagger
 * /:
 *   get:
 *     summary: for the test the api is still alive?
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// the endpoint for adding a new reservation
/**
 * @swagger
 * /reservation/addReservation:
 *   post:
 *     summary: Add a new reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               guests:
 *                 type: integer
 *               specialRequests:
 *                 type: string
 *               reserveDate:
 *                 type: string
 *               reserveTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: A successful response
 */
router.post("/addReservation", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("guestName", sql.VarChar, req.body.name)
      .input("guestEmail", sql.VarChar, req.body.email)
      .input("guestTel", sql.VarChar, req.body.phone)
      .input("guestPax", sql.Int, req.body.guests)
      .input("guestRemarks", sql.VarChar, req.body.specialRequests)
      .input("guestDate", sql.Date, req.body.reserveDate)
      .input("guestTime", sql.VarChar, req.body.reserveTime)
      .query(
        "INSERT INTO tbl_reservation_table (name, email, tel, pax, remarks, reserve_date, reserve_time) VALUES (@guestName, @guestEmail, @guestTel, @guestPax, @guestRemarks, @guestDate, CAST(@guestTime AS TIME))"
      );
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

// the endpoint for getting all reservations
/**
 * @swagger
 * /reservation/getAllReservation:
 *   get:
 *     summary: Get all reservations
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/getAllReservation", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query("SELECT * FROM tbl_reservation_table");
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

// the endpoint for getting a single reservation (by id)
/**
 * @swagger
 * /reservation/getReservation/{id}:
 *   get:
 *     summary: Get a single reservation by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/getReservation/:id", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM tbl_reservation_table WHERE id = @id");
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

// the endpoint for updating a reservation (by id)
/**
 * @swagger
 * /reservation/updateReservation/{id}:
 *   put:
 *     summary: Update a reservation by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               guests:
 *                 type: integer
 *               specialRequests:
 *                 type: string
 *               reserveDate:
 *                 type: string
 *               reserveTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: A successful response
 */
router.put("/updateReservation/:id", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("guestName", sql.VarChar, req.body.name)
      .input("guestEmail", sql.VarChar, req.body.email)
      .input("guestTel", sql.VarChar, req.body.phone)
      .input("guestPax", sql.Int, req.body.guests)
      .input("guestRemarks", sql.VarChar, req.body.specialRequests)
      .input("guestDate", sql.Date, req.body.reserveDate)
      .input("guestTime", sql.VarChar, req.body.reserveTime)
      .query(
        "UPDATE tbl_reservation_table SET name = @guestName, email = @guestEmail, tel = @guestTel, pax = @guestPax, remarks = @guestRemarks, reserve_date = @guestDate, reserve_time = CAST(@guestTime AS TIME) WHERE id = @id"
      );
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

// the endpoint for deleting a reservation (by id)
/**
 * @swagger
 * /reservation/deleteReservation/{id}:
 *   delete:
 *     summary: Delete a reservation by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A successful response
 */
router.delete("/deleteReservation/:id", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM tbl_reservation_table WHERE id = @id");
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

// the endpoint for getting reservations by guest name or phone or email or start date or end date
/**
 * @swagger
 * /reservation/getReservationByGuestNameStartDateEndDate/{guestName}/{phone}/{email}/{startDate}/{endDate}:
 *   get:
 *     summary: Get reservations by guest name or phone or email or start date or end date
 *     parameters:
 *       - in: path
 *         name: guestName
 *         required: false
 *         schema:
 *           type: string
 *       - in: path
 *         name: phone
 *         required: false
 *         schema:
 *           type: string
 *       - in: path
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *       - in: path
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: path
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A successful response
 *       500:
 *         description: An error occurred
 */

router.get(
  "/getReservationByGuestNameStartDateEndDate/:guestName/:phone/:email/:startDate/:endDate",
  async function (req, res, next) {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("guestName", sql.VarChar, req.params.guestName)
        .input("phone", sql.VarChar, req.params.phone)
        .input("email", sql.VarChar, req.params.email)
        .input("startDate", sql.Date, req.params.startDate)
        .input("endDate", sql.Date, req.params.endDate)
        .query(
          "SELECT * FROM tbl_reservation_table " +
          "WHERE name LIKE '%@guestName%' OR " +
          "(reserve_date BETWEEN @startDate AND @endDate) OR " +
          "tel LIKE '%@phone%' OR " +
          "email LIKE '%@email%'"
        );
      return res.status(200).json({
        data: result.recordset
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err
      });
    }
  }
);

module.exports = router;
