const userController = require("../controllers/user-controller");
const express = require("express");
const router = express.Router();




router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/getUsers").get(userController.getAllUsers);







module.exports = router;



