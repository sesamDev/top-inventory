const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all items
exports.item_list = (req, res, next) => {
  Item.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      //Sucessfull, so render
      res.render("item_list", {
        title: "Item List",
        item_list: list_items,
      });
    });
};

// Display form for adding a new category
exports.item_create_get = (req, res, next) => {
  // Get all categories which can be used for the item.
  Category.find({}, "name")
    .sort("ascending")
    .exec((err, category) => {
      if (err) {
        return next(err);
      }

      // No errors so render
      res.render("item_form", {
        title: "Create new item",
        item: "",
        categories: category,
      });
    });
};

// Handle creating item on POST
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("manufacturer", "Manufacturer must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  body("instock", "Must not be empty").isLength({ min: 0 }).escape(),

  // Process request
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Category object with validated data and old id
    const item = new Item({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      inStock: req.body.instock,
      category: req.body.category._id,
    });
    if (!errors.isEmpty()) {
      // There are errors, render form again and show errors
      res.render("item_form", {
        title: "Create new item",
        item: "",
        errors: errors,
      });
      return;
    }
    // Data from form is valid, Update the record.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Sucessful, redirect to category detail page.
      res.redirect(item.url);
    });
  },
];

// Display form for updating a new category
exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
      categories(callback) {
        Category.find({}, "name").sort("ascending").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      // No errors so render
      res.render("item_form", {
        title: "Update item",
        item: results.item,
        categories: results.categories,
      });
    }
  );
};

// Handle update item on POST
exports.item_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("manufacturer", "Manufacturer must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  body("instock", "Must not be empty").isLength({ min: 0 }).escape(),

  // Process request
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Category object with validated data and old id
    const item = new Item({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      inStock: req.body.instock,
      category: req.body.category._id,
    });
    if (!errors.isEmpty()) {
      // There are errors, render form again and show errors
      async.parallel(
        {
          item(callback) {
            Item.findById(req.params.id).exec(callback);
          },
          categories(callback) {
            Category.find({}, "name").sort("ascending").exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // No errors so render
          res.render("item_form", {
            title: "Update item",
            item: results.item,
            categories: results.categories,
          });
        }
      );
      return;
    }
    // Data from form is valid, Update the record.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Sucessful, redirect to category detail page.
      res.redirect(item.url);
    });
  },
];

// Display item delete form on GET
exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) {
      return next(err);
    }

    // No errors, render delete page
    res.render("item_delete", {
      title: "Delete Item",
      item: item,
    });
  });
};

// Handle item delete on post
exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndRemove(req.params.id).exec((err) => {
    if (err) {
      return next(err);
    }

    // Successfuly deleted, redirect to category list
    res.redirect("/inventory/item");
  });
};

// Display item details
exports.item_detail = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) {
      return next(err);
    }

    if (item == null) {
      // No item found
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }

    // Sucessfull, so render
    res.render("item_detail", {
      title: "Item Details",
      item: item,
    });
  });
};
