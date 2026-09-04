const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tables-controller");




router.route("/addTable").post(tableController.addTable);
router.route("/getTables").get(tableController.getAllTables);
router.route("/:tableId").get(tableController.getSingleTable);
router.route("/:tableId").delete(tableController.deleteTable);
router.route("/:tableId").patch(tableController.updateTable);







module.exports = router;