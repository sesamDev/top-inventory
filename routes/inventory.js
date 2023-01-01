const express = require("express");
const router = express.Router();

// Require controller modules.
const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

/// ROUTES ///

// GET category list.
router.get("/categories", categoryController.category_list);

// GET items list.
router.get("/items", itemController.item_list);

module.exports = router;
