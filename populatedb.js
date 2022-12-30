#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/?retryWrites=true&w=majority"
);

// Get arguments passed on command line
// eslint-disable-next-line no-undef
var userArgs = process.argv.slice(2);

// If no arguments were passed
if (!userArgs[0].startsWith("mongodb")) {
  console.log("ERROR: You need to specify a valid mongodb URL as the first argument");
  return;
}

var async = require("async");
var Category = require("./models/category");
var Item = require("./models/item");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let categories = [];
let items = [];

function categoryCreate(name, desc, cb) {
  const category = new Category({
    name: name,
    description: desc,
  });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, manufacturer, description, inStock, category, cb) {
  let itemDetail = {
    name: name,
    manufacturer: manufacturer,
    description: description,
    inStock: inStock,
    category: category,
  };
  if (category != false) itemDetail.category = category;

  let item = new Item(itemDetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Book: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategory(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("Keycaps", "Collection of keycaps", callback);
      },
      function (callback) {
        categoryCreate("Switches", "Collection of switches", callback);
      },
      function (callback) {
        categoryCreate("Barebone", "Collection of barebones", callback);
      },
      function (callback) {
        categoryCreate("Custom Keyboards", "Collection of assembled keyboards", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate("MX-red", "Cherry", "Silent linear switch", 200, categories[1], callback);
      },
      function (callback) {
        itemCreate("MX-brown", "Cherry", "Tactile switch", 100, categories[1], callback);
      },
      function (callback) {
        itemCreate(
          "PBT Double-shot Keycaps Nordisk Layout - Exotic",
          "Unknown",
          "Highest quality PBT keycaps!",
          150,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "GMMK Pro 75% Barebone ISO Black Slate",
          "Glorious",
          "A keyboard in it's own league!",
          20,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate("K2 V2 White LED", "Keychron", "Good entry custom keyboard", 5, categories[3], callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategory, createItems],
  // Optional callback
  function (err) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
