const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tables-controller");
const validator = require("../middlewares/validator");
const tableSchemaValidation = require("../validations/tableValidation");
const verifyToken = require("../middlewares/verifyToken")


router.route("/addTable").post(validator(tableSchemaValidation),verifyToken,tableController.addTable);
router.route("/getTables").get(tableController.getAllTables);
router.route("/:tableId").get(tableController.getSingleTable);
router.route("/:tableId").delete(tableController.deleteTable);
router.route("/updateTable/:tableId").patch(validator(tableSchemaValidation),tableController.updateTable);







module.exports = router;