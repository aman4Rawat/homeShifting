
const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const packageSchame = require("../admin/packageSchame.js");
const gallarySchema = require("./gallarySchema.js");
const CategorySchema = require("../services/categorySchema.js");
const {socialMediaSchemas,clickSchema} = require("./socialMedia.js");
const {reviewsSchema,suggestionsSchema} = require("./reviews.js");
const {pruchasedPackageSchema} = require("../payment/paymentSchema.js");
const userSchema = require("../user/userSchema.js");
const notificationSchema = require("../notification/notificationSchema.js");
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    vendorProfile: async (body) => {
      try {
        const user = await userSchema.findOne({mobile_number:body.mobileNumber});
        if(!user){
          return new Error("No user found with this number Please register first");
        }
       
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
          if(body.categoryId){ 
            const category = await CategorySchema.findById({_id:body.categoryId});
           }else{
            return new Error("Please select category");
            }
            const code = Date.now();
            condition.userId = user.id;
            condition.categoryName = category.name;
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
        const reviews = await reviewsSchema.find({vendorId:vendor._id}).populate("userId");
        const totalServices = await vendorBusinessSchema.find({userId:vendor.userId},{categoryName:1,categoryId:1,companyName:1});
        const links = await socialMediaSchemas.findOne({vendorId:totalServices._id});
        return {vendor,gallary,links,reviews,totalServices};
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
    vendorSocialMedia: async (data,id) => {
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
            other: data.other,
          });
          const abc = await account.save();
          return abc;
        }else{
          const condition = {};
          for (const key in data) {
            if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
              condition[key] = data[key];
            }
          }
          const xyz = await socialMediaSchemas.findOneAndUpdate({vendorId:id},{$set:condition},{new:true});
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
    addressUpdate: async (data,id) => {
      try {
          const business = await vendorBusinessSchema.findOne({_id:id});
          if(!business){return new Error("vendor id galat hai")};
          const condition = {}
          for (const key in data) {
            if (data[key] !== undefined) {
              condition[key] = data[key];
            }
          }

          const result = await vendorBusinessSchema.findByIdAndUpdate({_id:business.id},{$set:{address:condition}},{new:true});
          return result;
      } catch (err) {
        return err;
      }
    },
    paymentTypeUpdate: async (data,id) => {
      try {

        const business =  await vendorBusinessSchema.findById({_id:id});
        if(!business){return new Error("vendor id galat hai")};
        
        const result = await vendorBusinessSchema.findByIdAndUpdate({_id:business.id},{$set:{paymentType:data.paymentType}},{new:true});
        return result;
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
    // depricated uploadPayment
    // uploadPayment: async (data,vendorId) => {
    //   try {
    //     const abc = await vendorPaymentTypeSchemas.findOne({vendorId:vendorId});
    //     if(!abc){
    //       const condition={}
    //       condition.vendorId = vendorId;
    //       for (const key in data) {
    //         if (data[key] !== undefined) {
    //           condition[key] = data[key];
    //         }
    //       }
    //       const xyz = new vendorPaymentTypeSchemas(condition);
    //       const result = await xyz.save();
    //       return result;
    //     }else{
    //       const condition={}
    //       for (const key in data) {
    //         if (data[key] !== undefined) {
    //           condition[key] = data[key];
    //         }
    //       }
    //       const result = await vendorPaymentTypeSchemas.findByIdAndUpdate({_id:abc.id,vendorId:vendorId},{$set:condition},{new:true});
    //       return result;
    //     }
    //   } catch (err) {
    //     return err;
    //   }
    // },
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
        else{
          return "You can't Increase click on your own business";
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
        socialPercentage = parseFloat((social.length/totalCount)*100);
        webSitePercentage = parseFloat( (webSite.length/totalCount)*100);
        callPercentage = parseFloat((call.length/totalCount)*100);
        bestDealPercentage = parseFloat((bestDeal.length/totalCount)*100);
        directionPercentage = parseFloat((direction.length/totalCount)*100);
        return {socialPercentage,webSitePercentage,callPercentage,bestDealPercentage,directionPercentage}
       
      } catch (err) {
        return err;
      }
    },
    dashboardCallLeadsVendor: async (body) => {
      try {
        const callLeads = await clickSchema.find({ businessId: body?.bid, clickType:body.type }).populate("userId",{createdAt:0}).populate("businessId",{createdAt:0, timing:0}).skip((body.page -1)*body.limit).limit(body.limit);;
        return callLeads
       
      } catch (err) {
        return err;
      }
    },
    dashboardAllLeads: async (body) => {
      try {
        const businessNameAndAmount = await vendorBusinessSchema.findOne({userId:body.userId},{wallet:1,companyName:1}).sort({createdAt:1});
        const condition = {}
        condition.businessId = businessNameAndAmount?._id ?? "64ca05ef24a527edc66a0ea1";
        if(body.startDate && !body.endDate){ return "please enter end date as well"}
        if(body.startDate){
          const edate = new Date(body.endDate.split("/").reverse().join("/"));
          const sdate = new Date(body.startDate.split("/").reverse().join("/"));
          condition.createdAt = {$gte: sdate,$lte: edate}; //I'll fix it soon
        }
        if(body.isNew){
          condition.isNaya = true;
        }
        if(body.isRead){
          condition.isRead = true;
        }
        // const callLeads = await clickSchema.find(condition).populate("userId",{createdAt:0}).populate("businessId",{timing:0,createdAt:0}).skip((body.page -1)*body.limit).limit(body.limit);
        const callLeads = await clickSchema.find(condition).sort({createdAt:-1}).populate("userId",{createdAt:0}).populate("businessId",{timing:0,createdAt:0});
        return {businessNameAndAmount,callLeads}
       
      } catch (err) {
        return new Error(err);
      }
    },
    dashboardSingleLeadInfo: async (body) => {
      try {
        
        const callLeads = await clickSchema.findByIdAndUpdate({_id:body.lid},{$set:{isNaya:false,isRead:true}},{new:true}).populate("userId").populate("businessId",{timing:0,uniqueId:0,profileImage:0,userId:0,__v:0,_id:0,area:0,designation:0});
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
        const business = await vendorBusinessSchema.find({},{packageId:1});
        const id = business[0].packageId._id;
        console.log(id);
        const result = await packageSchame.find({ _id: { $ne: id } });
        return result;
      } catch (err) {
        return err;
      }
    },
    currentPackageDetails: async (userId) => {
      try {
        const result = await vendorBusinessSchema.findOne({userId:userId},{packageId:1}).populate("packageId");
        if(!result){
          return "No package found with this user";
        }
        const packageDetails = await pruchasedPackageSchema.findOne({businessId:result._id,packageId:result.packageId._id}).sort({createdAt:1});
        return packageDetails;
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





    support: async (data) => {
      try {
        const user = await userSchema.findById({_id:data.userId},{name:1});
        const business = await vendorBusinessSchema.findOne({userId:data.userId},{companyName:1,uniqueId:1, name:1}).sort({createdAt:-1});

        if(!user){
          return new Error("No user found with this Id");
        }
        let poplu = user?.name.split(" ").join("%20")
        let sexa = business?.companyName.split(" ").join("%20");
        if(data.type === "business"){
          const number = process.env.WHATSAPPNUMBER;
        const massage = `Hello%20Team%2C%0AI%20want%20to%20change%20something%20in%20my%20business%20profile%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`
        return {number, massage};
      }
        if(data.type === "leads"){
          const number = process.env.WHATSAPPNUMBER;
          const massage = `Hello%20Team%2C%0AI%20want%20to%20discuss%20something%20about%20*Leads*%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`
          return {number, massage};
      }
        if(data.type === "payment"){
          const number = process.env.WHATSAPPNUMBER;
        const massage = `Hello%20Team%2C%0AI%20want%20to%20discuss%20something%20about%20*Payment*%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`
        return {number, massage};
      }
        if(data.type === "other"){
          const number = process.env.WHATSAPPNUMBER;
          const massage = `Hello%20Team%2C%0AI%20want%20to%20discuss%20something%20about%20*Other*%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`
          return {number, massage};
      }
      } catch (err) {
        return err;
      }
    },

    askForRating: async (body) => {
      try {
        const user = await userSchema.findOne({mobile_number:body.customerNumber});
        if(!user){
          return new Error("No user found with this number Please enter registered number");
        }
        const vendor = await vendorBusinessSchema.findOne({userId:body.userId});
        const title = "Please rate me";
        const description = `Hey ${body.customerName}, </br> please rate me on my profile, it will help me to grow my business. </br> best regards ${vendor.companyName}`;

        const notification = new notificationSchema({
          title:title,
          description:description,
          userId: user._id,
          image: BASEURL+"images/i/defaultuser.jpg",
          from: vendor.name,
        })
        await notification.save();
        return "notification send"
       
      }
      catch (err) {
        return err;
      }
    },
    businessReviewList: async (body) => {
      try {
        const reviews = await reviewsSchema.find({vendorId:body.businessId}).populate("userId",{createdAt:0});
        return reviews;
      } catch (err) {
        return err;
      }
    },
    responseReviewById: async (body) => {
      try {
        const business = await vendorBusinessSchema.findById({_id:body.businessId},{companyName:1,profileImage:1});
        const obj = {
          companyName:business.companyName,
          profileImage:business.profileImage,
          response:body.response
        }
        const response = await reviewsSchema.findByIdAndUpdate({_id:body.reviewId},{$push:{response:obj}},{new:true});

      } catch (err) {
        return err;
      }
    },

  };
} catch (e) {
  log.error(e);
}
