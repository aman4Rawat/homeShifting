const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('image')) {
      fs.mkdirSync('image', { recursive: true });
    }
    cb(null, 'image');
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    let fileExt = '.jpeg';
    const extI = originalname.lastIndexOf('.');
    if (extI !== -1) {
      fileExt = originalname.substring(extI).toLowerCase();
    }
    const fileName = `${Date.now()}-image${fileExt}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
}).single('Image');

const multiUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(png|jpg|JPG|PNG|jpeg|JPEG|pdf|PDF|docx|mp4|doc)$/
      )
    ) {
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
}).fields([{ name: "Aadhar" }, { name: "PAN" },{ name: "Company" }, { name: "Other" }]);

module.exports = function (req, res, next) {
  upload(req, res, function (err) {
        if (err) {
      return res.status(500).json({msg:'File upload failed gggg'});
    }
    next();
  });
  
  multiUpload(req, res, function (err) {
        if (err) {
     console.log(err);
    }
    next();
  });
};
