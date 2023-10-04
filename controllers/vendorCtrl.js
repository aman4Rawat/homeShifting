
const vendorModel = require("../models/vendor/index.js");
const upload = require("../middlewares/multer.js");
const multiUpload = require("../middlewares/multiMulter.js");
const gallerymultiUpload = require("../middlewares/multerGallery.js");
const utils = require("../libs/utils");
const BASEURL = process.env.BASEURL;

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
            latitude: req.body.latitude,
            longitude: req.body.longitude,
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
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
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
        gallerymultiUpload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (req.files.length === 0) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = [];
          req.files.map((item) => {
            data.push(BASEURL+item.path);
          });
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
      const id =req.body.businessId;

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
    updateAdderss: async (req, res, next) => {
      try {
        
        const data = {
          buldingName:req.body.buldingName,
          streetName:req.body.streetName,
          landmark:req.body.landmark,
          area:req.body.area,
          pinCode:req.body.pinCode,
          city:req.body.city,
          state:req.body.state,
          country:req.body.country,
          latitude:req.body.latitude,
          longitude:req.body.longitude,
        }
        const id = req.body.businessId;
        const result = await vendorModel.addressUpdate(data,id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      }
      catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updatePatmentType: async (req, res, next) => {
      try {
        

        const data = {
         paymentType:req.body.paymentType,
        };
        const id = req.body.businessId;
        const result = await vendorModel.paymentTypeUpdate(data,id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      }
      catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },

    updateVendorDetails: async (req, res, next) => {
      try {
        if(!req.role === "VENDOR"){
          return  res.status(403).send(utils.error("Only Vender can update there details"));
        }
        const data = req.body;
        const businessId = req.body.businessId;
        const result = await vendorModel.vendorDetailsUpdate(data,businessId);
        return res.status(200).send(utils.response(result));

      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },


    //reviews apis
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
    getMyReviewOfThisVendor: async (req, res) => {
      try {
        
        const data = {
          businessId:req.body.businessId,
          userId:req.userId,
        }
        const result = await vendorModel.myReviewOfVendor(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
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
          businessId:req.body.businessId,
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
  // depricated uploadPaymentType
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
            .send(utils.error("your role must be user or vendor"));
        }
        const body = {
          businessId: req.body.businessId,
          userId: req.userId,
          clickType: req.body.clickType,
          userName: req.body.userName,
          userNumber : req.body.userNumber,
          userEmail: req.body.userEmail,
          userQuery: req.body.userQuery,
        };
        const result = await vendorModel.socialMediaClick(body);
        if(result instanceof Error){
          return res.status(403).send(utils.error(result.message));
        }else{
        return res.status(200).send(utils.response(result));
        }
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
          userId: req.userId,
          startDate:req.body.startDate,
          endDate:req.body.endDate,
          isNew:req.body.isNew,
          isRead:req.body.isRead,
          businessId:req.body.businessId,
          limit: req.body.limit || 10,
          page: req.body.page || 1,
        };
        const data = {}
        for (const key in body) {
          if (body[key] !== undefined) {
            data[key] = body[key];
          }
        }
        const result = await vendorModel.dashboardAllLeads(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
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
    packageDetails: async (req, res) => {
      try {
        if (req.role === "USER") {
          return res
            .status(401)
            .send(utils.error("user can't see package details"));
        }
        const result = await vendorModel.detailsofPackage();
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    currentPackageDetails: async (req, res) => {
      try {
        if (req.role === "USER") { 
          return res.status(401).send(utils.error("user can't see package details"));
        }
        const body = {
          userId: req.userId,
          businessId: req.body.businessId,
        }
        const result = await vendorModel.currentPackageDetails(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
        return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },



    singlePackageDetailsById: async (req, res) => {
      try {
        if (req.role === "USER") {
          return res
            .status(401)
            .send(utils.error("user can't see package details"));
        }
        const pid = req.body.packageId;
        const result = await vendorModel.detailsSinglePackagebyId(pid);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    support: async (req, res) => {
        const body = {
          userId: req.userId,
          type: req.body.type
        };
        if(body.type !== "business" && body.type !== "payment" && body.type !== "leads" && body.type !== "other"){
          return res.status(403).send(utils.error("type must be business or payment or leads or other"));
        }
        const result = await vendorModel.support(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      },
      
      askForRating: async (req, res) => {
        try {
          if (req.role !== "VENDOR") {
            return res
              .status(401)
              .send(utils.error("Only Vendor can see there Dashboard call leads"));
          }
          const body = {
            userId: req.userId,
            businessId: req.body.businessId,
            customerName: req.body.customerName,
            customerNumber: req.body.customerNumber,
          };
          const result = await vendorModel.askForRating(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
        } catch (err) {
          return res.status(403).send(utils.error(err));
        } 
      },

      passbookListing: async (req, res) => {
        try {
          if (req.role !== "VENDOR") {
            return res.status(401).send(utils.error("Only Vendor can see there passbook details"));
          }
          const body = {
            userId: req.userId,
            businessId: req.body.businessId,
            startDate:req.body.startDate,
            endDate:req.body.endDate,
          }
          const result = await vendorModel.passbookListing(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
        } catch (err) {
          return res.status(403).send(utils.error(err));
        }
      },

      businessReviewList: async (req, res) => {
        try {
          if (req.role !== "VENDOR") {
            return res
              .status(401)
              .send(utils.error("Only Vendor can see there Dashboard reviews"));
          }
          const body = {
            userId: req.userId,
            businessId: req.body.businessId,
          };
          const result = await vendorModel.businessReviewList(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
        } catch (err) {
          return res.status(403).send(utils.error(err));
        } 
      },
      responseReviewById: async (req, res) => {
        try {
          if (req.role !== "VENDOR") {
            return res
              .status(401)
              .send(utils.error("Only Vendor can see there Dashboard reviews"));
          }
          const body = {
            userId: req.userId,
            businessId: req.body.businessId,
            reviewId: req.body.reviewId,
            response: req.body.response,
          };
          const result = await vendorModel.responseReviewById(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
        } catch (err) {
          return res.status(403).send(utils.error(err));
        } 
      },




  };
} catch (err) {
  console.log(err);
}

