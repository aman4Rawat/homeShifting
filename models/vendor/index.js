
const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const gallarySchema = require("./gallarySchema.js");
const socialMediaSchema = require("./socialMedia.js");
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
        const vendor = await vendorBusinessSchema.findById({_id:id});
        if(!vendor){
          return "No vendor found with this category ";
        }
        const gallary = await gallarySchema.find({vendorId:vendor._id})
        return {vendor,gallary};
      } catch (err) {
        return err;
      }
    },
    vendorDocumentsimageUpload: async (data,id) => {
      try {
        const condition = {};
        if(data.Aadhar){
          condition.aadharImage = BASEURL+data.Aadhar;
        }
        if(data.PAN){
          condition.panImage = BASEURL+data.PAN;
        }
        if(data.Other){
          condition.otherDocumentImage = BASEURL+data.Other;
        }
        if(data.Company){
          condition.companyCertificateImage = BASEURL+data.Company;
        }
      const vendorBusiness = await vendorBusinessSchema.findByIdAndUpdate({_id:id},{$set:condition},{new:true});
      return vendorBusiness;
      } catch (err) {
        return err;
      }
    },
    vendorGallaryUpload: async (data, id) => {
      try {
        
        const results = await vendorBusinessSchema.findById({_id:id});
        if(!results){
          return new Error("No vendor found with this Id");
        }
        const newGallary = new gallarySchema({
          vendorId:id,
          image: BASEURL+data
        })
        await newGallary.save();
        return "successfully uploaded"
      } catch (err) {
        return err;
      }
    },
    vendorSocialMedia: async (data, id) => {
      try {
        
        //lkdjaksdjklalskdlajsdlajs asjkldla sdjlasjd lasd jlasdjasd jklasjkljlkasdjlas dasdasd jkl
      } catch (err) {
        return err;
      }
    },

  };
} catch (e) {
  log.error(e);
}