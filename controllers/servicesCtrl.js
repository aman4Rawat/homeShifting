
const serviceModel = require('../models/services/index.js');
const categoryModel = require('../models/services/index.js');
const upload = require("../middlewares/multer.js");
const utils = require("../libs/utils.js");
const BASEURL = process.env.BASEURL;
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
    updateservice: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {return res.status(401).send(utils.error("Only Admin can create Services"));}
      upload(req, res, async (err) => {
          if (err) { return res.status(500).send(utils.error("Internal server error")); }
          const image = req.file.path;
          const id = req.body.id;
          if(!id){return res.status(404).send(utils.error("Id is required"));}
          const name = req.body.name;
          const data = {};
        if(name){
          data.name = name;
        }
        if(image){
          data.image = BASEURL+image;
        }
        const result = await serviceModel.updateService(id,data)
        return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return err;
      }
    },
    getAllService:async(req, res)=>{
      try{
        const body = req.body;
        const result = await serviceModel.allServices(body);
          return res.status(200).send(utils.response(result));
      }catch(err){return err}
    },
    deleteService:async(req, res)=>{
      try{
        const id = req.body.id;
        if(!id){return res.status(200).send(utils.error("id required"));}
        const result = await serviceModel.deleteService(id);
          return res.status(200).send(utils.response(result));
      }catch(err){return err}
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
    getallcategories:async(req, res)=>{
      try{
        const body = req.body;
        const result = await serviceModel.allCategories(body);
          return res.status(200).send(utils.response(result));
      }catch(err){return err}
    },
    updatecategory: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {return res.status(401).send(utils.error("Only Admin can create Services"));}
       upload(req, res, async (err) => {
          if (err) { return res.status(500).send(utils.error("Internal server error")); }
          const image = req.file.path;
          const id = req.body.id;
       if(!id){return res.status(401).send(utils.error("Id is required"));}
       const name = req.body.name;
       const serviceId = req.body.serviceId;
       const data = {};
        if(serviceId){
          data.serviceId = serviceId;
        }
        if(name){
          data.name = name;
        }
        if(image){
          data.image = BASEURL+image;
        }
        const result = await categoryModel.updateCategory(id,data)
        return res.status(200).send(utils.response(result));
        });
        
      } catch (err) {
        return err;
      }
    },
    deletecategory:async(req, res)=>{
      try{
        const id = req.body.id;
        if(!id){return res.status(200).send(utils.error("id required"));}
        const result = await serviceModel.deletecategory(id);
          return res.status(200).send(utils.response(result));
      }catch(err){return err}
    },
    categoriesbyserviceid:async(req, res)=>{
      try{
        const body = req.body;
        if(!body.serviceId){return res.status(404).send(utils.error("serviceId required"));}
        const result = await serviceModel.categoriesbyservice(body);
          return res.status(200).send(utils.response(result));
      }catch(err){return err}
    },
    allserviceandcategory:async(req, res)=>{
      try{
        const result = await serviceModel.serviceAndCategoryAll();
          return res.status(200).send(utils.response(result));
      }catch(err){return err}
    },
  };
} catch (err) {
  console.log(err);
}
