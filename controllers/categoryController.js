const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all categories
exports.category_list = (req, res, next) => {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      //Sucessful, so render
      res.render("category_list", {
        title: "Category List",
        category_list: list_categories,
      });
    });
};

// Display form for adding a new category
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {
    title: "Create new category",
  });
};

// Handle creating category on POST
exports.category_create_post = (req, res, next) => {
  res.send("TO BE IMPLEMENTED");
};

// Display form for updating a new category
exports.category_update_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      // Successful, so render
      res.render("category_form", {
        title: "Update category",
        category: results.category,
        items: results.category_items,
      });
    }
  );
};

// Handle update category on POST
exports.category_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),

  // Process request
  (req, res, next) => {
    console.log(req.body);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with validated data and old id
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors, render form again and show errors
      async.parallel(
        {
          category(callback) {
            Category.findById(req.params.id).exec(callback);
          },
          category_items(callback) {
            Item.find({ category: req.params.id }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Successful, so render
          res.render("category_form", {
            title: "Update category",
            category: results.category,
            items: results.category_items,
            errors: errors.array(),
          });
        }
      );
    }

    // Data from form is valid, Update the record.
    Category.findByIdAndUpdate(req.params.id, category, {}, (err, theCategory) => {
      if (err) {
        return next(err);
      }

      // Sucessful, redirect to category detail page.
      res.redirect(theCategory.url);
    });
  },
];

// Display category delete form on GET
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      // No errors, render delete page
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

// Handle category delete on post
exports.category_delete_post = (req, res, next) => {
  Category.findByIdAndRemove(req.params.id).exec((err) => {
    if (err) {
      return next(err);
    }

    // Successfuly deleted, redirect to category list
    res.redirect("/inventory/category");
  });
};

// Display category details
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }, "name description inStock").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // Found no category
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Sucessfull, so render
      res.render("category_detail", {
        title: "Category Details",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};
