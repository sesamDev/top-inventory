const express = require("express");
const router = express.Router();

// Require controller modules.
const inventoryController = require("../controllers/inventoryContoller");

/// ROUTES ///

// GET inventory home page.
router.get("/", inventoryController.index);

module.exports = router;
