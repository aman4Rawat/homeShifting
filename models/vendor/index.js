
const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    vendorProfile: async (body) => {
      try {
        const condition = {};
        for (const key in body) {
          if (body[key] !== undefined) {
            condition[key] = body[key];
          }
        }
        const results = await vendorBusinessSchema.find(condition);
        if(results.length>0){
          return results
        }else{
          const newBusiness = new vendorBusinessSchema(condition);
          const results = await newBusiness.save();
          return results
        }

      } catch (err) {
        return err;
      }
    },
    vendorprofileimageUpload: async (data, id) => {
      try {
        
        const results = await vendorBusinessSchema.findById({_id:id});
        if(!results){
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL+data;
        await vendorBusinessSchema.findByIdAndUpdate({_id:id},{$set:{profileImage:image}},{new:true})
        return "image Updated sucessfully";
      } catch (err) {
        return err;
      }
    },
    vendorBackgroundimageUpload: async (data, id) => {
      try {
        
        const results = await vendorBusinessSchema.findById({_id:id});
        if(!results){
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL+data;
        await vendorBusinessSchema.findByIdAndUpdate({_id:id},{$set:{bgImage:image}},{new:true})
        return "image Updated sucessfully";
      } catch (err) {
        return err;
      }
    },
    vwndorByCategoryId: async (cId) => {
      try {
        const results = await vendorBusinessSchema.find({categoryId:cId});
        return results;
      } catch (err) {
        return err;
      }
    },
    vendorById: async (id) => {
      try {
        const results = await vendorBusinessSchema.find({_id:id});
        if(!results){
          return "No vendor found with this category ";
        }
        return results;
      } catch (err) {
        return err;
      }
    },

  };
} catch (e) {
  log.error(e);
}