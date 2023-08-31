
const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const packageSchame = require("../admin/packageSchame.js");
const gallarySchema = require("./gallarySchema.js");
const {socialMediaSchemas,vendorPaymentTypeSchemas,clickSchema} = require("./socialMedia.js");
const {reviewsSchema,suggestionsSchema} = require("./reviews.js");
const userSchema = require("../user/userSchema.js");
const ratingSchema = require("../user/ratingSchema.js");
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
    vendorById: async (id) => {
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
    vendorBudinessByUserId: async (id) => {
      try {
        const vendor = await vendorBusinessSchema.find({userId:id},{categoryName:1,categoryId:1,companyName:1,name:1,profileImage:1});
        if(!vendor){
          return "No Business found with this category ";
        }
        return vendor;
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
    socialMediaClick: async (body) => {
      try {
        const business = await vendorBusinessSchema.findOne({_id:body.businessId});
        if(business.userId != body.userId){
          const condition = {};
          condition.vendorId=business.userId;
          for (const key in body) {
            if (body[key] !== undefined) {
              condition[key] = body[key];
            }
          }
          const click = new clickSchema(condition)
          const result = await click.save();
          return result
        }     
      } catch (err) {
        return err;
      }
    },
    businessDashboardVendor: async (body) => {
      try {
        const clicks = await clickSchema.find({ businessId: body.bid });
        const totalCount = await clickSchema.find({businessId:body.bid}).countDocuments();

        const social = [];
        const call = [];
        const bestDeal = [];
        const webSite = [];
        const direction = [];
        clicks.map((x)=>{
          if(x.clickType === 'SOCIAL'){
            social.push(x);
          }
          if(x.clickType === 'WEBSITE'){
            webSite.push(x);
          }
          if(x.clickType === 'BESTDEAL'){
            bestDeal.push(x);
          }
          if(x.clickType === 'CALL'){
            call.push(x);
          }
          if(x.clickType === 'DIRECTION'){
            direction.push(x);
          }
        })
        socialPercentage = (social.length/totalCount)*100;
        webSitePercentage = (webSite.length/totalCount)*100;
        callPercentage = (call.length/totalCount)*100;
        bestDealPercentage = (bestDeal.length/totalCount)*100;
        directionPercentage = (direction.length/totalCount)*100;
        return {socialPercentage,webSitePercentage,callPercentage,bestDealPercentage,directionPercentage}
       
      } catch (err) {
        return err;
      }
    },
    dashboardCallLeadsVendor: async (body) => {
      try {
        const callLeads = await clickSchema.find({ businessId: body.bid, clickType:body.type }).populate("userId").populate("businessId").skip((body.page -1)*body.limit).limit(body.limit);;
        return callLeads
       
      } catch (err) {
        return err;
      }
    },
    dashboardAllLeads: async (body) => {
      try {
        const businessNameAndAmount = await vendorBusinessSchema.findOne({userId:body.uid},{wallet:1,companyName:1}).sort({createdAt:1});
        const condition = {}
        condition.businessId = businessNameAndAmount._id;
        if(body.startDate && body.endDate){
          condition.createdAt = {$gte: startDate,$lte: endDate};
        }
        if(body.isNew){
          condition.isNaya = true;
        }
        if(body.isRead){
          condition.isRead = true;
        }
        const callLeads = await clickSchema.find(condition).populate("userId").populate("businessId",{timing:0}).skip((body.page -1)*body.limit).limit(body.limit);
        return {businessNameAndAmount,callLeads}
       
      } catch (err) {
        return err;
      }
    },
    dashboardSingleLeadInfo: async (body) => {
      try {
        
        const callLeads = await clickSchema.findByIdAndUpdate({_id:body.lid},{$set:{isNaya:false,isRead:true}},{new:true}).populate("userId").populate("businessId");
        return callLeads
       
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
    detailsofPackage: async () => {
      try {
       const result = await packageSchame.find();
        return result;
      } catch (err) {
        return err;
      }
    },
    detailsSinglePackagebyId: async (pid) => {
      try {
       const package = await packageSchame.findById({_id:pid});
       const packageDetails = package.packageDetalis;
       const amount = package.packageAmount;
       const gst = (amount * 18)/100 ;
       const totalAmount = amount+gst;

        return {packageDetails,amount,gst,totalAmount};
      } catch (err) {
        return err;
      }
    },
    packagePurchase: async (body) => {
      try {
        const package = await packageSchame.findById({_id:body.packageId});
        const business = await vendorBusinessSchema.findById({_id:body.businessId});
        const user = await userSchema.findById({_id:body.userId});
        const amount = package.packageAmount;
        const gst = (amount * 18)/100 ;
        const totalAmount = amount+gst;
        const expireDate = new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth()+package.packageDuration));
        const userPlane = new userPlaneSchema({
          //here I have to use the perametor from schema accordingly
        })
        const result = await userPlane.save();
        return result;
      } catch (err) {
        return err;
      }
    },

  };
} catch (e) {
  log.error(e);
}