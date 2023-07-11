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

// Export the middleware function
module.exports = function (req, res, next) {
  upload(req, res, function (err) {
    console.log(req.file, req.files)
    if (err) {
      return res.status(500).json({msg:'File upload failed'});
    }
    next();
  });
};
