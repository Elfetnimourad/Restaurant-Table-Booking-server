const userController = require("../controllers/user-controller");
const express = require("express");
const router = express.Router();
const validator = require("../middlewares/validator");
const userSchemaValidation = require("../validations/userValidation");
const {userRateLimitter} = require("../middlewares/rateLimiter");
const verifyToken = require("../middlewares/verifyToken");


router.route("/register").post(validator(userSchemaValidation),userController.register);
router.route("/login").post(validator(userSchemaValidation),userRateLimitter,userController.login);
router.route("/getUsers").get(userController.getAllUsers);
router.route("/me").get(verifyToken,userController.me);








module.exports = router;



