const https = require("https");
const fs = require("fs");

const file = fs.createWriteStream("file.csv");

module.exports = {
  getData: (url) => {
    https.get(url, function (response) {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
      });
    });
  },
};
