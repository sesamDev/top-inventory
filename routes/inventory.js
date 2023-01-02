const express = require("express");
const router = express.Router();

// Require controller modules.
const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

/// CATEGORY ROUTES ///

// GET request for viewing category list.
router.get("/category", categoryController.category_list);

// GET request for creating a category.
router.get("/category/create", categoryController.category_create_get);

// POST request for creating a category.
router.post("/category/create", categoryController.category_create_post);

// GET request for updating a category.
router.get("/category/:id/update", categoryController.category_update_get);

// POST request for updating a category.
router.post("/category/:id/update", categoryController.category_update_post);

// GET request for deleting a category.
router.get("/category/:id/delete", categoryController.category_delete_get);

// POST request for deleting a category.
router.post("/category/:id/delete", categoryController.category_delete_post);

// GET request for viewing a category.
router.get("/category/:id", categoryController.category_detail);

/// ITEM ROUTES ///

// GET request for viewing item list.
router.get("/item", itemController.item_list);

// GET request for creating an item.
router.get("/item/create", itemController.item_create_get);

// POST request for creating an item.
router.post("/item/create", itemController.item_create_post);

// GET request for updating an item.
router.get("/item/:id/update", itemController.item_update_get);

// POST request for updating an item.
router.post("/item/:id/update", itemController.item_update_post);

// GET request for deleting an item.
router.get("/item/:id/delete", itemController.item_delete_get);

// POST request for deleting an item.
router.post("/item/:id/delete", itemController.item_delete_post);

// GET request for viewing an item.
router.get("/item/:id", itemController.item_detail);

module.exports = router;
