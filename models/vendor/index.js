
const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const gallarySchema = require("./gallarySchema.js");
const {socialMediaSchemas,vendorPaymentTypeSchemas} = require("./socialMedia.js");
const {reviewsSchema,suggestionsSchema} = require("./reviews.js");
const userSchema = require("../user/userSchema.js");
const ratingSchema = require("../user/ratingSchema.js");
const mongoose = require("mongoose");
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    vendorProfile: async (body) => {
      try {
        const user = await userSchema.findOne({mobile_number:body.mobileNumber});
        if(!user){
          return new Error("No user found with this number Please register first");
        }
        console.log(user,"this is user for user.id or user._id")
        const condition = {};
        for (const key in body) {
          if (body[key] !== undefined) {
            condition[key] = body[key];
          }
        }
        const results = await vendorBusinessSchema.find(condition).populate("userId");
        if(results.length>0){
          return results
        }else{
          const code = Date.now();
          condition.userId = user.id;
          condition.uniqueId = code;
          const newBusiness = new vendorBusinessSchema(condition);
          const results = await newBusiness.save();
          await userSchema.findByIdAndUpdate({_id:user.id},{$set:{role:"VENDOR"}},{new:true});
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
    vendorByCategoryId: async (cId,sort) => {
      try {
       const condition = {};
        if(sort==="TOP"){
          condition.rating = -1
        };
        if(sort==="VERIFIED"){
          condition.isVerified = -1
        };
        if(sort==="EXPERT"){
          condition.isExpert = -1
        };
       const results = await vendorBusinessSchema.find({categoryId:cId}).sort(condition);
        return results;
      } catch (err) {
        return err;
      }
    },
    vendorById: async (id,userId) => {
      try {
        const vendor = await vendorBusinessSchema.findById({_id:id});
        if(!vendor){
          return "No vendor found with this category ";
        }
        const gallary = await gallarySchema.find({vendorId:vendor._id});
        const mediaLinks = await socialMediaSchemas.find({vendorId:vendor._id});
        const reviews = await reviewsSchema.find({vendorId:vendor._id}).populate("userId");
        const totalServices = await vendorBusinessSchema.find({userId:vendor.userId},{categoryName:1,categoryId:1,companyName:1});
        return {vendor,gallary,mediaLinks,reviews,totalServices};
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
        const vendor = await socialMediaSchemas.findOne({vendorId:id});
        if(!vendor){
          const account = new socialMediaSchemas({
            vendorId:id,
            website: data.website,
            facebook: data.facebook,
            instagram: data.instagram,
            twitter: data.twitter,
            youtube: data.youtube,
            linkedin: data.linkedin,
            snapchat: data.snapchat,
            whatsapp: data.whatsapp,
            other: data.other,
            
          });
          const abc = await account.save();
          return abc;
        }else{
          const condition = {};
          for (const key in data) {
            if (data[key] !== undefined) {
              condition[key] = data[key];
            }
          }
          const xyz = await socialMediaSchemas.findByIdAndUpdate({_id:vendor.id,vendorId:id},{$set:condition},{new:true});
          return xyz;
        }
      } catch (err) {
        return err;
      }
    },
    businessDetailsUpdate: async (data) => {
      try {
        const vendor = await vendorBusinessSchema.findOne({_id:data.id});
        if(!vendor){return new Error("vendor id galat hai")};
        const condition = {}
        if(data.name){
          condition.name = data.name;
        }
        if(data.area){
          condition.area = data.area;
        }
        if(data.categoryId){
          condition.categoryId = data.categoryId;
        }
        if(data.userId){
          condition.userId = data.userId;
        }
        if(data.rating){
          condition.rating = data.rating;
        }
        if(data.esteblish){
          condition.yearOfEsteblish = data.esteblish;
        }

          const xyz = await vendorBusinessSchema.findByIdAndUpdate({_id:vendor.id},{$set:condition},{new:true});
          return xyz;
        
      } catch (err) {
        return err;
      }
    },
    reviewByUser: async (data) => {
      try {
        const abc = new reviewsSchema({
          vendorId:data.vid,
          review: data.review,
          rating:data.rating,
          userId:data.userId
        })
        const xyz = await abc.save();
        return xyz;
      } catch (err) {
        return err;
      }
    },
    contactDetailUpdate: async (data) => {
      try {
        const user = await vendorBusinessSchema.findOne({userId:data.venderId})
        const result = await vendorBusinessSchema.findByIdAndUpdate({_id:user.id},{$set:
          {
            contactPersonName:data.contactName,
            designation:data.designation,
            whatsappNumber:data.whatsappNumber,
            mobileNumber:data.mobileNumber,
            email:data.email,
          }},{new:true});
        return result;
      } catch (err) {
        return err;
      }
    },
    timingDetailUpdate: async (data,id) => {
      try {
        const abc = await vendorBusinessSchema.findById({_id:id});
        const result = await vendorBusinessSchema.findByIdAndUpdate({_id:id},{timing:data},{new:true});
        return result;
      } catch (err) {
        return err;
      }
    },
    uploadPayment: async (data,vendorId) => {
      try {
        const abc = await vendorPaymentTypeSchemas.findOne({vendorId:vendorId});
        if(!abc){
          const condition={}
          condition.vendorId = vendorId;
          for (const key in data) {
            if (data[key] !== undefined) {
              condition[key] = data[key];
            }
          }
          const xyz = new vendorPaymentTypeSchemas(condition);
          const result = await xyz.save();
          return result;
        }else{
          const condition={}
          for (const key in data) {
            if (data[key] !== undefined) {
              condition[key] = data[key];
            }
          }
          const result = await vendorPaymentTypeSchemas.findByIdAndUpdate({_id:abc.id,vendorId:vendorId},{$set:condition},{new:true});
          return result;
        }
      } catch (err) {
        return err;
      }
    },

    //===================== Apis only for Vender side ==================

    suggestionOfVender: async (data) => {
      try {
        const abc = new suggestionsSchema({
          vendorId:data.vendorId,
          subject: data.subject,
          description:data.description
        })
        const xyz = await abc.save();
        return xyz;
      } catch (err) {
        return err;
      }
    },

  };
} catch (e) {
  log.error(e);
}