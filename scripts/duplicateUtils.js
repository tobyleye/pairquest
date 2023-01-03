const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../utils.js");
const destination = path.resolve(__dirname, "../server/utils.js");

fs.watch(filePath, (eventType) => {
  if (eventType === "change") {
    fs.copyFile(filePath, destination, (err) => {
      if (err) {
        console.log("cant copy, error:", err);
      } else {
        console.log("util duplicated");
      }
    });
  }
});
