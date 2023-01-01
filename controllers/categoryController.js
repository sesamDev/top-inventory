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
