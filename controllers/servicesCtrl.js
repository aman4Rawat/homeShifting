
const serviceModel = require('../models/services/index.js');
const categoryModel = require('../models/services/index.js');
const upload = require("../middlewares/multer.js");
const utils = require("../libs/utils.js");

try {
  module.exports = {
    createservice: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {return res.status(401).send(utils.error("Only Admin can create Services"));}
        upload(req, res, async (err) => {
          if (err) { return res.status(500).send(utils.error("Internal server error")); }
          if (!req.file) {return res.status(400).send(utils.error("No file found")); }
          const data = {};
          data.name = req.body.name;
          data.image = req.file.path;
          const result = await serviceModel.createService(data);
          return res.status(201).send(utils.response(result));
        });
      } catch (err) {
        return err;
      }
    },
    createcategory: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {return res.status(401).send(utils.error("Only Admin can create Services"));}
        upload(req, res, async (err) => {
          if (err) { return res.status(500).send(utils.error("Internal server error")); }
          if (!req.file) {return res.status(400).send(utils.error("No file found")); }
          const data = {};
          data.name = req.body.name;
          data.serviceId = req.body.serviceId;
          data.image = req.file.path;
          const result = await categoryModel.createCategory(data);
          return res.status(201).send(utils.response(result));
        });
      } catch (err) {
        return err;
      }
    },
    getAllService:async(req, res)=>{
      try{
        const body = req.body;
        const result = await serviceModel.allServices(body);
          return res.status(201).send(utils.response(result));
      }catch(err){return err}
    },
    getallcategories:async(req, res)=>{
      try{
        const body = req.body;
        const result = await serviceModel.allCategories(body);
          return res.status(201).send(utils.response(result));
      }catch(err){return err}
    },
  };
} catch (err) {
  console.log(err);
}
