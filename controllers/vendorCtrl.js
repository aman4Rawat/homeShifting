
const vendorModel = require("../models/vendor/index.js");
const upload = require("../middlewares/multer.js");
const multiUpload = require("../middlewares/multiMulter.js");
const utils = require("../libs/utils");

try {

 
  module.exports = {

    createVendorProfile: async (req, res, next) => {
        try {
          const body={
            companyName: req.body.companyName,
            constactPersonName: req.body.constactPersonName,
            mobileNumber: req.body.mobileNumber,
            area: req.body.area,
            pinCode: req.body.pinCode,
            categoryId: req.body.businessCategory,
          }
          const result = await vendorModel.vendorProfile(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(201).send(utils.response(result));
          }
        } catch (err) {
          return res.status(403).send(utils.error(err.message));
        }
      },
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
    findVendorbyCategoryId: async (req, res) => {
      try {
        const cId = req.body.id;
        const sort = req.body.sort;
        const result = await vendorModel.vendorByCategoryId(cId,sort);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    findVendorbyId: async (req, res) => {
      try {
        const id = req.body.id;
        const result = await vendorModel.vendorById(id);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    findVendorBusinessByToken: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only Vendors have Business"));
        }
        const id = req.userId;
        const result = await vendorModel.vendorBudinessByUserId(id);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    vendorprofileimage: async (req, res, next) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file.path;
          const id = req.body.id;
          const result = await vendorModel.vendorprofileimageUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    vendorbackgroundimage: async (req, res, next) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file.path;
          const id = req.body.id;
          const result = await vendorModel.vendorBackgroundimageUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadVendorDocuments:  async (req, res, next) => {
      try {
        if(!req.role === "VENDOR" ){
          return res.status(403).send(utils.error("Only Vendor can Upload Documents"));
        }
        multiUpload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.files) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = {};
          if(req.files.Aadhar){
            data.Aadhar = req.files.Aadhar[0].path;
          }
          if(req.files.PAN){
          data.PAN = req.files.PAN[0].path;
          }
          if(req.files.Other){
          data.Other = req.files.Other[0].path;
          }
          if(req.files.Company){
            data.Company = req.files.Company[0].path;
          }
          const id = req.body.id;
          const result = await vendorModel.vendorDocumentsimageUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadgallary: async (req, res, next) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file.path;
          const id = req.body.id;
          const result = await vendorModel.vendorGallaryUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadSocialMedia: async (req, res, next) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can suggest"));
        }
        const data = {
          website:req.body.website,
          facebook:req.body.facebook,
          instagram:req.body.instagram,
          twitter: req.body.twitter,
          youtube: req.body.youtube,
          linkedin:req.body.linkedin,
          whatsapp:req.body.whatsapp,
          snapchat:req.body.snapchat,
          other:req.body.other,
        }
        const id = req.userId;
        const result = await vendorModel.vendorSocialMedia(data,id);
        return res.status(200).send(utils.response(result));

      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updatebusinessDetails: async (req, res, next) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can suggest"));
        }
        const data = {
          name:req.body.name,
          rating:req.body.rating,
          yearOfEsteblish:req.body.esteblish,
          categoryId:req.body.categoryId,
          categoryName:req.body.categoryName,
          userId:req.body.userId,
          area:req.body.area,
          id:req.userId,
        }
        const result = await vendorModel.businessDetailsUpdate(data);
        return res.status(200).send(utils.response(result));

      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    



    reviewThisVendor: async (req, res) => {
      try {
        if(!req.role === "USER"){
          return  res.status(403).send(utils.error("Only user can review to Vendor"));
        }
        const data = {
          vid:req.body.vendorId,
          review: req.body.review,
          rating:req.body.rating,
          userId:req.userId,
        }
      
        const result = await vendorModel.reviewByUser(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    //======== Apis for Vender side as only ==============

    suggestion: async (req, res) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can suggest"));
        }
        const data = {
          description: req.body.description,
          subject:req.body.subject,
          venderId:req.userId,
        }
        const result = await vendorModel.suggestionOfVender(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updateContactDetails: async (req, res) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can add contact details"));
        }
        const data = {
          contactName: req.body.contactName,
          designation:req.body.designation,
          whatsappNumber:req.body.whatsappNumber,
          mobileNumber:req.body.mobileNumber,
          email:req.body.email,
          venderId:req.userId,
        }
        const result = await vendorModel.contactDetailUpdate(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadTiming: async (req, res) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can add there timings"));
        }
        const id = req.body.vendorId;
        const data =req.body.timing;
        const result = await vendorModel.timingDetailUpdate(data,id);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadPaymentType: async (req, res) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can add Payment types"));
        }
        const vendorId = req.userId;
        const data ={
          phonePay: req.body.phonePay||false,
          googlePay: req.body.googlePay||false,
          paytm: req.body.paytm||false,
          debitCardCreditCard: req.body.debitCardCreditCard||false,
          netBanking: req.body.netBanking||false,
          cashOnDelivery: req.body.cashOnDelivery||false,
          check: req.body.check||false,
          IMPS: req.body.IMPS||false,
        };
        const result = await vendorModel.uploadPayment(data,vendorId);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    clickOnSocialMedia: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("your role must be buer or vendor"));
        }
        const body = {
          businessId: req.body.businessId,
          userId: req.userId,
          clickType: req.body.clickType,
          name: req.body.name,
          userName: req.body.userName,
          userNumber : req.body.userNumber,
          userEmail: req.body.userEmail,
          userQuery: req.body.userQuery,
        };
        const result = await vendorModel.socialMediaClick(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    businessDashboard: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only Vendor can see there Dashboard"));
        }
        const body = {
          bid: req.body.businessId,
          uid: req.userId,
        };
        const result = await vendorModel.businessDashboardVendor(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    dashboardCallLeads: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only Vendor can see there Dashboard call leads"));
        }
        const body = {
          bid: req.body.businessId,
          uid: req.userId,
          type: req.body.type,
          limit: req.body.limit || 10,
          page: req.body.page || 1,

        };
        const result = await vendorModel.dashboardCallLeadsVendor(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    dashboardLeads: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only Vendor can see there Dashboard call leads"));
        }
        const body = {
          bid: req.body.businessId,
          uid: req.userId,
          startDate:req.body.startDate,
          endDate:req.body.endDate,
          isNew:req.body.isNew,
          isRead:req.body.endDate,
          limit: req.body.limit || 10,
          page: req.body.page || 1,
        };
        const result = await vendorModel.dashboardAllLeads(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    dashboardLeadById: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only Vendor can see there Dashboard call lead"));
        }
        const body = {
          lid:req.body.leadId,
        };
        const result = await vendorModel.dashboardSingleLeadInfo(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
  };
} catch (err) {
  console.log(err);
}
