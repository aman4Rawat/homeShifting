const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('gallery')) {
      fs.mkdirSync('gallery', { recursive: true });
    }
    cb(null, 'gallery');
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    let fileExt = '.jpeg';
    const extI = originalname.lastIndexOf('.');
    if (extI !== -1) {
      fileExt = originalname.substring(extI).toLowerCase();
    }
    const fileName = `${Date.now()}-gallery${fileExt}`;
    cb(null, fileName);
  },
});

const gallerymultiUpload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(png|jpg|JPG|PNG|jpeg|JPEG|pdf|PDF|docx|mp4|doc)$/
      )
    ) {
      return cb(new Error("Please upload a file with valid extension"));
    }
    cb(undefined, true);
  },
}).array('Image', 10);

module.exports = function (req, res, next) {
  gallerymultiUpload(req, res, function (err) {
        if (err) {
     console.log(err,"wallah");
    }
    next();
  });
};
