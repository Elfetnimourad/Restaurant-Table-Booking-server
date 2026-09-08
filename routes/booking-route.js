const express = require("express");
const router = express.Router();
const bookingsContollers = require("../controllers/booking-controller")


router.route("/addBooking").post(bookingsContollers.addBookings);
router.route("/getAllBookings").get(bookingsContollers.getAllBookings);
router.route("/getSingleBooking").get(bookingsContollers.getSingleBooking);
router.route("/cancelBooking/:booking_id").patch(bookingsContollers.cancelBooking);
router.route("/my").get(bookingsContollers.myBooking);
router.route("/updateBooking").patch(bookingsContollers.updateBooking)



module.exports = router;