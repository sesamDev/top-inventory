const Category = require("../models/category");

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
  res.send("TO BE IMPLEMENTED");
};

// Handle update category on POST
exports.category_update_post = (req, res, next) => {
  res.send("TO BE IMPLEMENTED");
};

// Display category delete form on GET
exports.category_delete_get = (req, res, next) => {
  res.send("TO BE IMPLEMENTED");
};

// Handle category delete on post
exports.category_delete_post = (req, res, next) => {
  res.send("TO BE IMPLEMENTED");
};

// Display category details
exports.category_detail = (req, res, next) => {
  res.render("category_detail", {
    title: "Will show category name here",
    id: req.params.id,
  });
};
