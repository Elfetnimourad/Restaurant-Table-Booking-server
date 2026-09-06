const express = require("express");
const router = express.Router();
const bookingsContollers = require("../controllers/booking-controller")


router.route("/addBooking").post(bookingsContollers.addBookings);
router.route("/getAllBookings").get(bookingsContollers.getAllBookings);
router.route("/getSingleBooking").get(bookingsContollers.getSingleBooking);
router.route("/cancelBooking/:user_id").patch(bookingsContollers.cancelBooking);




module.exports = router;