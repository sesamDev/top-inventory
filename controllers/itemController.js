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
exports.item_create_get = (req, res) => {
  res.render("item_form", {
    title: "Create new item",
    item: "",
  });
};

// Handle creating item on POST
exports.item_create_post = [
  // Validate and sanitize fields.
  // body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  // body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  // // Process request
  // (req, res, next) => {
  //   console.log(req.body);
  //   // Extract the validation errors from a request.
  //   const errors = validationResult(req);
  //   // Create a Category object with validated data and old id
  //   const category = new Category({
  //     name: req.body.name,
  //     description: req.body.description,
  //   });
  //   if (!errors.isEmpty()) {
  //     // There are errors, render form again and show errors
  //     res.render("category_form", {
  //       title: "Create new category",
  //       category: "",
  //       errors: errors,
  //     });
  //     return;
  //   }
  //   // Data from form is valid, Update the record.
  //   category.save((err) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     // Sucessful, redirect to category detail page.
  //     res.redirect(category.url);
  //   });
  // },
];

// Display form for updating a new category
exports.item_update_get = (req, res, next) => {
  // async.parallel(
  //   {
  //     category(callback) {
  //       Category.findById(req.params.id).exec(callback);
  //     },
  //     category_items(callback) {
  //       Item.find({ category: req.params.id }).exec(callback);
  //     },
  //   },
  //   (err, results) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     // Successful, so render
  //     res.render("category_form", {
  //       title: "Update category",
  //       category: results.category,
  //       items: results.category_items,
  //     });
  //   }
  // );
};

// Handle update item on POST
exports.item_update_post = [
  // Validate and sanitize fields.
  // body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  // body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  // // Process request
  // (req, res, next) => {
  //   console.log(req.body);
  //   // Extract the validation errors from a request.
  //   const errors = validationResult(req);
  //   // Create a Category object with validated data and old id
  //   const category = new Category({
  //     name: req.body.name,
  //     description: req.body.description,
  //     _id: req.params.id,
  //   });
  //   if (!errors.isEmpty()) {
  //     // There are errors, render form again and show errors
  //     async.parallel(
  //       {
  //         category(callback) {
  //           Category.findById(req.params.id).exec(callback);
  //         },
  //         category_items(callback) {
  //           Item.find({ category: req.params.id }).exec(callback);
  //         },
  //       },
  //       (err, results) => {
  //         if (err) {
  //           return next(err);
  //         }
  //         // Successful, so render
  //         res.render("category_form", {
  //           title: "Update category",
  //           category: results.category,
  //           items: results.category_items,
  //           errors: errors.array(),
  //         });
  //       }
  //     );
  //   }
  //   // Data from form is valid, Update the record.
  //   Category.findByIdAndUpdate(req.params.id, category, {}, (err, theCategory) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     // Sucessful, redirect to category detail page.
  //     res.redirect(theCategory.url);
  //   });
  // },
];

// Display item delete form on GET
exports.item_delete_get = (req, res, next) => {
  // async.parallel(
  //   {
  //     category(callback) {
  //       Category.findById(req.params.id).exec(callback);
  //     },
  //     category_items(callback) {
  //       Item.find({ category: req.params.id }).exec(callback);
  //     },
  //   },
  //   (err, results) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     // No errors, render delete page
  //     res.render("category_delete", {
  //       title: "Delete Category",
  //       category: results.category,
  //       category_items: results.category_items,
  //     });
  //   }
  // );
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
