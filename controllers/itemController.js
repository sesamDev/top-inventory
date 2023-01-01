const Item = require("../models/item");

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
