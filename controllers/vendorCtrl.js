const vendorModel = require("../models/vendor/index.js");
const upload = require("../middlewares/multer.js");
const multiUpload = require("../middlewares/multiMulter.js");
const gallerymultiUpload = require("../middlewares/multerGallery.js");
const utils = require("../libs/utils");
const mongoose = require("mongoose");
const BASEURL = process.env.BASEURL;

try {
  module.exports = {
    createVendorProfile: async (req, res, next) => {
      try {
        const body = {
          companyName: req.body.companyName,
          constactPersonName: req.body.constactPersonName,
          mobileNumber: req.body.mobileNumber,
          area: req.body.area,
          pinCode: req.body.pinCode,
          categoryId: req.body.businessCategory,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        };
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
        if (results.length > 0) {
          return results;
        } else {
          const newBusiness = new vendorBusinessSchema(condition);
          const results = await newBusiness.save();
          return results;
        }
      } catch (err) {
        return err;
      }
    },
    findVendorbyCategoryIdAndLocation: async (req, res) => {
      try {
        const cId = req.body.id;
        const sort = req.body.sort;
        const location = req.body.location;
        if (!mongoose.isValidObjectId(cId)) {
          return res
            .status(401)
            .send(utils.error("Please provide category id"));
        }
        const result = await vendorModel.vendorByCategoryIdAndLocation(
          cId,
          sort,
          location
        );
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
          const result = await vendorModel.vendorBackgroundimageUpload(
            data,
            id
          );
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    createBanner: async (req, res, next) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const media = req.file.path;
          const v_id = req.body.id;
          console.log("media, v_id", media, v_id);
          const result = await vendorModel.createVendorBanner(media, v_id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    // deleteBanner: async (req, res, next) => {
    //   try {
    //       const v_id = req.body.id;
    //       console.log("media, v_id", media, v_id)
    //       const result = await vendorModel.deleteVendorBanner(
    //         v_id
    //       );
    //       if (result instanceof Error) {
    //         return res.status(403).send(utils.error(result.message));
    //       } else {
    //         return res.status(200).send(utils.response(result));
    //       }
    //     } catch (err) {
    //       return res.status(403).send(utils.error(err));
    //     }
    // },
    uploadVendorDocuments: async (req, res, next) => {
      try {
        if (!req.role === "VENDOR") {
          return res
            .status(403)
            .send(utils.error("Only Vendor can Upload Documents"));
        }
        multiUpload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.files) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = {};
          if (req.files.Aadhar) {
            data.Aadhar = req.files.Aadhar[0].path;
          }
          if (req.files.PAN) {
            data.PAN = req.files.PAN[0].path;
          }
          if (req.files.Other) {
            data.Other = req.files.Other[0].path;
          }
          if (req.files.Company) {
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
            data.push(BASEURL + item.path);
          });
          const id = req.body.id;
          const result = await vendorModel.vendorGallaryUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    deletegallaryimages: async (req, res, next) => {
      try {
        const imageLink = req.body.imageLink;
        const result = await vendorModel.vendorGallaryDelete(imageLink);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadSocialMedia: async (req, res, next) => {
      try {
        if (!req.role === "VENDOR") {
          return res.status(403).send(utils.error("Only Vender can suggest"));
        }
        const data = {
          website: req.body.website || "null",
          facebook: req.body.facebook || "null",
          instagram: req.body.instagram || "null",
          twitter: req.body.twitter || "null",
          youtube: req.body.youtube || "null",
          linkedin: req.body.linkedin || "null",
          whatsapp: req.body.whatsapp || "null",
          snapchat: req.body.snapchat || "null",
          other: req.body.other || "null",
        };
        const id = req.body.businessId;

        const result = await vendorModel.vendorSocialMedia(data, id);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updatebusinessDetails: async (req, res, next) => {
      try {
        if (!req.role === "VENDOR" || !req.role === "ADMIN") {
          return res
            .status(403)
            .send(utils.error("Only Vender adn Admin can update details"));
        }
        const data = {
          name: req.body.name,
          rating: req.body.rating,
          yearOfEsteblish: req.body.esteblish,
          categoryId: req.body.categoryId,
          categoryName: req.body.categoryName,
          userId: req.body.userId,
          area: req.body.area,
          id: req.userId,
        };
        const result = await vendorModel.businessDetailsUpdate(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updateAdderss: async (req, res, next) => {
      try {
        const data = {
          buldingName: req.body.buldingName,
          streetName: req.body.streetName,
          landmark: req.body.landmark,
          area: req.body.area,
          pinCode: req.body.pinCode,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        };
        const searchAddress = (
          data?.area +
          data?.city +
          data?.state
        ).replaceAll(" ", "");

        const id = req.body.businessId;
        const result = await vendorModel.addressUpdate(data, id, searchAddress);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updatePatmentType: async (req, res, next) => {
      try {
        const data = {
          paymentType: req.body.paymentType,
        };
        const id = req.body.businessId;
        const result = await vendorModel.paymentTypeUpdate(data, id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updateVendorDetails: async (req, res, next) => {
      try {
        if (!req.role === "VENDOR") {
          return res
            .status(403)
            .send(utils.error("Only Vender can update there details"));
        }
        const data = req.body;
        const businessId = req.body.businessId;
        const result = await vendorModel.vendorDetailsUpdate(data, businessId);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    addSubcategoryByBusinessId: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res.status(401).send(utils.error("Login as a vendor "));
        }
        const subCategories = req.body.subCategoriesname;
        const businessId = req.body.businessId;
        const result = await vendorModel.addSubCategoryByBusinessId(
          businessId,
          subCategories
        );
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return error;
      }
    },
    removeSubcategoryByBusinessId: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res.status(401).send(utils.error("Login as a vendor "));
        }
        const subCategories = req.body.subCategoriesname;
        const businessId = req.body.businessId;
        const result = await vendorModel.addSubCategoryByBusinessId(
          businessId,
          subCategories
        );
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return error;
      }
    },
    //reviews apis
    reviewByBusinessId: async (req, res) => {
      try {
        const data = {
          businessId: req.body.businessId,
          sort: req.body.sort,
        };
        const result = await vendorModel.reviewByBusinessId(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    reviewThisVendor: async (req, res) => {
      try {
        const data = {
          vid: req.body.vendorId,
          review: req.body.review,
          rating: req.body.rating,
          userId: req.userId,
        };

        const result = await vendorModel.reviewByUser(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    getMyReviewOfThisVendor: async (req, res) => {
      try {
        const data = {
          businessId: req.body.businessId,
          userId: req.userId,
        };
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
        if (!req.role === "VENDOR") {
          return res.status(403).send(utils.error("Only Vender can suggest"));
        }
        const data = {
          description: req.body.description,
          subject: req.body.subject,
          venderId: req.userId,
        };
        const result = await vendorModel.suggestionOfVender(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    updateContactDetails: async (req, res) => {
      try {
        if (!req.role === "VENDOR") {
          return res
            .status(403)
            .send(utils.error("Only Vender can add contact details"));
        }
        const data = {
          contactName: req.body.contactName,
          designation: req.body.designation,
          whatsappNumber: req.body.whatsappNumber,
          mobileNumber: req.body.mobileNumber,
          email: req.body.email,
          venderId: req.userId,
          businessId: req.body.businessId,
        };
        const result = await vendorModel.contactDetailUpdate(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    // depricated uploadTiming
    uploadTiming: async (req, res) => {
      try {
        if (!req.role === "VENDOR") {
          return res
            .status(403)
            .send(utils.error("Only Vender can add there timings"));
        }
        const id = req.body.vendorId;
        const data = req.body.timing;
        const result = await vendorModel.timingDetailUpdate(data, id);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    // depricated uploadPaymentType
    nameUpdateRequest: async (req, res) => {
      try {
        if (!req.role === "VENDOR") {
          return res
            .status(403)
            .send(utils.error("Only Vender can add Payment types"));
        }
        const vendorId = req.userId;
        const data = {
          businessId: req.body.businessId,
          requestedName: req.body.name,
          venderId: req.userId,
        };
        const result = await vendorModel.nameUpdateRequest(data);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    uploadPaymentType: async (req, res) => {
      try {
        if (!req.role === "VENDOR") {
          return res
            .status(403)
            .send(utils.error("Only Vender can add Payment types"));
        }
        const vendorId = req.userId;
        const data = {
          phonePay: req.body.phonePay || false,
          googlePay: req.body.googlePay || false,
          paytm: req.body.paytm || false,
          debitCardCreditCard: req.body.debitCardCreditCard || false,
          netBanking: req.body.netBanking || false,
          cashOnDelivery: req.body.cashOnDelivery || false,
          check: req.body.check || false,
          IMPS: req.body.IMPS || false,
        };
        const result = await vendorModel.uploadPayment(data, vendorId);
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
          userNumber: req.body.userNumber,
          userEmail: req.body.userEmail,
          userQuery: req.body.userQuery,
        };
        const result = await vendorModel.socialMediaClick(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
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
            .send(
              utils.error("Only Vendor can see there Dashboard call leads")
            );
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
            .send(
              utils.error("Only Vendor can see there Dashboard call leads")
            );
        }
        const body = {
          userId: req.userId,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          isNew: req.body.isNew,
          isRead: req.body.isRead,
          businessId: req.body.businessId,
          limit: req.body.limit || 10,
          page: req.body.page || 1,
        };
        const data = {};
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
          lid: req.body.leadId,
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
        const { skip = 0, limit = 10 } = req.body;
        const result = await vendorModel.detailsofPackage(skip, limit);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    currentPackageDetails: async (req, res) => {
      try {
        if (req.role === "USER") {
          return res
            .status(401)
            .send(utils.error("user can't see package details"));
        }
        const body = {
          userId: req.userId,
          businessId: req.body.businessId,
        };
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
        type: req.body.type,
      };
      if (
        body.type !== "business" &&
        body.type !== "payment" &&
        body.type !== "leads" &&
        body.type !== "other"
      ) {
        return res
          .status(403)
          .send(
            utils.error("type must be business or payment or leads or other")
          );
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
            .send(
              utils.error("Only Vendor can see there Dashboard call leads")
            );
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
          return res
            .status(401)
            .send(utils.error("Only Vendor can see there passbook details"));
        }
        const body = {
          userId: req.userId,
          businessId: req.body.businessId,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        };
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
    //===================== Apis only for State and City ==================
    getState: async (req, res) => {
      try {
        const result = await vendorModel.getState();
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    getCity: async (req, res) => {
      try {
        const body = {
          stateId: req.body.stateId,
          search: req.body.search,
        };

        const result = await vendorModel.getCity(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    getLocality: async (req, res) => {
      try {
        const body = {
          cityId: req.body.cityId,
          search: req.body.search,
        };

        const result = await vendorModel.getLocality(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    searchLocation: async (req, res) => {
      try {
        const search = req.body.search;
        if (search.length < 3) {
          process.nextTick();
        } else {
          const result = await vendorModel.searchLocation(search);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    deleteVendor: async (req, res) => {
      try {
        const { id = "" } = req.body;
        if (id == "" || !mongoose.isValidObjectId(id)) {
          return res.status(403).send(utils.error("Please provide valid id!"));
        }
        const result = await vendorModel.deleteVendor(id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    listBanner: async (req, res) => {
      try {
        if (req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only Vendor can see there passbook details"));
        }
        const result = await vendorModel.listBanner(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    createPackageOrder: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can update options"));
        }
        const body = ({
          packageId = "",
          optionId = [],
          v_id = "",
        } = req.body);

        if (
          !mongoose.isValidObjectId(v_id) ||
          !mongoose.isValidObjectId(packageId)
        ) {
          return res
            .status(401)
            .send(utils.error("Please provide valid vendor and packageId"));
        }
        const result = await vendorModel.createPackageOrder(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    purchagePackage: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can update options"));
        }
        const body = { type = "", id = "", orderId="" } = req.body;
        if (body.id == "" || !body.id || !mongoose.isValidObjectId(body.id)) {
          return res.status(401).send(utils.error("Please provide valid id"));
        }
        if(orderId === ""||!orderId ){
          return res.status(401).send(utils.error("Please provide order id"));
        }

        const result = await vendorModel.purchasePackage(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    vendorListing: async (req, res) => {
      try {
        const result = await vendorModel.listTopVendor();
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    //   popularVendor: async (req, res) => {
    //     try{

    //     } catch (err) {
    //       return res.status(403).send(utils.error(err));
    //     }
    // };
  };
} catch (err) {
  console.log(err);
}
