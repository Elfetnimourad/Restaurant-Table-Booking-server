const express = require("express");
const router = express.Router();
const bookingsControllers = require("../controllers/booking-controller")
const validator = require("../middlewares/validator");
const bookingSchemaValidation = require("../validations/bookingValidation");
const verifyToken = require("../middlewares/verifyToken");
const {bookingRateLimitter} = require("../middlewares/rateLimiter");
const AuthorizedTo = require("../middlewares/AuthorizedTo");


router.route("/addBooking").post(validator(bookingSchemaValidation),verifyToken,AuthorizedTo("admin","customer"),bookingsControllers.addBookings);
router.route("/getAllBookings").get(verifyToken,bookingsControllers.getAllBookings);
router.route("/getSingleBooking").get(bookingsControllers.getSingleBooking);
router.route("/cancelBooking/:booking_id").patch(bookingRateLimitter,AuthorizedTo("admin","customer"),bookingsControllers.cancelBooking);
router.route("/my").get(verifyToken,bookingsControllers.myBooking);
router.route("/updateBooking/:booking_id").patch(validator(bookingSchemaValidation),bookingRateLimitter,bookingsControllers.updateBooking)


module.exports = router;