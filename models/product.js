const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, min: 3, max: 100, required: true },
  description: { type: String, min: 3, max: 100, required: true },
  inStock: { type: Number, min: 0, required: true },
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
