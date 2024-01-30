const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const packageSchame = require("../admin/packageSchame.js");
const optionsSchema = require("../admin/optionsSchema.js");
const gallarySchema = require("./gallarySchema.js");
const CategorySchema = require("../services/categorySchema.js");
const { socialMediaSchemas, clickSchema } = require("./socialMedia.js");
const { reviewsSchema, suggestionsSchema } = require("./reviews.js");
const {
  pruchasedPackageSchema,
  paymentSchema,
} = require("../payment/paymentSchema.js");
const invoiceSchema = require("../payment/invoiceSchema.js");
const { State, City, Locality } = require("./stateAndCitySchrma.js");
const { nameUpdateRequest } = require("./needfullSchema.js");
const passbookSchema = require("./passbookSchema.js");
const mongoose = require("mongoose");
const userSchema = require("../user/userSchema.js");
const notificationSchema = require("../notification/notificationSchema.js");
const referralCode = require("referral-code-generator");
const BASEURL = process.env.BASEURL;
const {
  imageDelete,
  galaryImageDelete,
} = require("../../services/deleteImage.js");

try {
  module.exports = {
    vendorProfile: async (body) => {
      try {
        let user = await userSchema.findOne({
          mobile_number: body.mobileNumber,
        });
        if (!user) {
          const codeRef = referralCode.alphaNumeric("uppercase", 2, 2);
          const newUser = new userSchema({
            mobile_number: body.mobileNumber,
            role: "VENDOR",
            refCode: codeRef,
          });
          user = await newUser.save();
        }

        const condition = {};

        for (const key in body) {
          if (
            body[key] !== undefined &&
            body[key] !== body.latitude &&
            body[key] !== body.longitude
          ) {
            condition[key] = body[key];
          }
        }
        condition.searchAddress = body.area;
        const results = await vendorBusinessSchema
          .find(condition)
          .populate("userId");
        if (results.length > 0) {
          return results;
        } else {
          if (body.categoryId) {
            var category = await CategorySchema.findById({
              _id: body.categoryId,
            });
          } else {
            return new Error("Please select category");
          }
          const code = Date.now();
          condition.userId = user.id;
          condition.categoryName = category.name;
          condition.uniqueId = code;
          if (body.latituse) {
            condition.latituse = body.latitude;
          }
          if (body.longitude) {
            condition.longitude = body.longitude;
          }
          const newBusiness = new vendorBusinessSchema(condition);
          const results = await newBusiness.save();
          await userSchema.findByIdAndUpdate(
            { _id: user.id },
            { $set: { role: "VENDOR" } },
            { new: true }
          );
          return results;
        }
      } catch (err) {
        return err;
      }
    },
    vendorprofileimageUpload: async (data, id) => {
      try {
        if (data) {
          const feild = "profileImage";
          await imageDelete(id, vendorBusinessSchema, feild);
        }
        const results = await vendorBusinessSchema.findById({ _id: id });
        if (!results) {
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL + data;
        await vendorBusinessSchema.findByIdAndUpdate(
          { _id: id },
          { $set: { profileImage: image } },
          { new: true }
        );
        return "image Updated sucessfully";
      } catch (err) {
        return err;
      }
    },
    vendorBackgroundimageUpload: async (data, id) => {
      try {
        if (data) {
          const feild = "bgImage";
          await imageDelete(id, vendorBusinessSchema, feild);
        }
        const results = await vendorBusinessSchema.findById({ _id: id });
        if (!results) {
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL + data;
        await vendorBusinessSchema.findByIdAndUpdate(
          { _id: id },
          { $set: { bgImage: image } },
          { new: true }
        );
        return "image Updated sucessfully";
      } catch (err) {
        return err;
      }
    },
    createVendorBanner: async (media, v_id) => {
      try {
        if (media) {
          const feild = "bannerImage";
          await imageDelete(v_id, vendorBusinessSchema, feild);
        }
        let results = await vendorBusinessSchema.findById(v_id);
        if (!results?._id) {
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL + media;
        results = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: v_id },
          { $set: { bannerImage: image } },
          { new: true }
        );
        return results;
      } catch (err) {
        return err;
      }
    },
    // deleteVendorBanner: async (v_id) => {
    //   try {
    //     if (media) {
    //       const feild = "bannerImage";
    //       await imageDelete(v_id, vendorBusinessSchema, feild);
    //     }
    //     let results = await vendorBusinessSchema.findById(v_id);
    //     if (!results?._id) {
    //       return new Error("No vendor found with this Id");
    //     }
    //     const image = BASEURL + media;
    //     results = await vendorBusinessSchema.findByIdAndUpdate(
    //       { _id: v_id },
    //       { $set: { bannerImage: image } },
    //       { new: true }
    //     );
    //     return results;
    //   } catch (err) {
    //     return err;
    //   }
    // },
    vendorByCategoryIdAndLocation: async (cId, sort, location = "ALL") => {
      try {
        const condition = {};
        const filter = {};
        //here we have to find vendor by location search if location is exist else jesa chl raha hai chlene do

        filter.categoryId = cId;
        // filter.wallet = { $gte: 10 }; //fuck

        if (location !== "ALL" || location !== "") {
          const pattern = new RegExp(location, "i");
          filter.searchAddress = { $regex: pattern };
        }

        if (sort === "TOP") {
          condition.ratingCount = -1;
        }
        // if (sort === "ALL") {
        // }
        if (sort === "VERIFIED") {
          filter.isVerified = true;
        }
        if (sort === "EXPERT") {
          filter.isExpert = true;
        }

        console.log("^^^^^^^^^^^^^^^^^^^^filter^^^^^^^^^^^^^^^^^^^^^", filter);
        const results = await vendorBusinessSchema
          .find(filter)
          .populate("packagePurchaseId")
          .sort(condition);
        return results;
      } catch (err) {
        return err;
      }
    },
    vendorById: async (id) => {
      try {
        const vendor = await vendorBusinessSchema.findById({ _id: id });
        if (!vendor) {
          return "No vendor found with this category ";
        }
        const gallary = await gallarySchema.find({ vendorId: vendor._id });
        const reviewsData = await reviewsSchema
          .find({ vendorId: vendor._id })
          .populate("userId");
        const sex = await vendorBusinessSchema.find(
          { _id: id },
          { services: 1 }
        );
        const totalServices = sex[0].services;
        const links = await socialMediaSchemas.findOne({
          vendorId: vendor._id,
        });
        let abc = 0;
        let count = 0;
        reviewsData.map((x) => {
          abc = abc + x.rating;
          count = count + 1;
        });
        var totalRating = (abc / count).toFixed(1);
        if (isNaN(totalRating)) {
          totalRating = 0;
        }
        const reviews = {
          totalRating: totalRating,
          totalReviews: count,
          reviewsData: reviewsData,
        };
        await vendorBusinessSchema.findByIdAndUpdate(
          { _id: vendor._id },
          { $set: { rating: totalRating, ratingCount: count } },
          { new: true }
        );
        return { vendor, gallary, links, reviews, totalServices };
      } catch (err) {
        return err;
      }
    },
    vendorBudinessByUserId: async (id) => {
      try {
        const vendor = await vendorBusinessSchema.find(
          { userId: id },
          { categoryName: 1, categoryId: 1, companyName: 1, profileImage: 1 }
        );
        if (!vendor) {
          return "No Business found with this category ";
        }
        return vendor;
      } catch (err) {
        return err;
      }
    },
    vendorDocumentsimageUpload: async (data, id) => {
      try {
        const condition = {};
        if (data.Aadhar) {
          condition.aadharImage = BASEURL + data.Aadhar;
        }
        if (data.PAN) {
          condition.panImage = BASEURL + data.PAN;
        }
        if (data.Other) {
          condition.otherDocumentImage = BASEURL + data.Other;
        }
        if (data.Company) {
          condition.companyCertificateImage = BASEURL + data.Company;
        }
        const vendorBusiness = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: id },
          { $set: condition },
          { new: true }
        );
        return vendorBusiness;
      } catch (err) {
        return err;
      }
    },
    vendorGallaryUpload: async (data, id) => {
      try {
        const results = await vendorBusinessSchema.findById({ _id: id });
        if (!results) {
          return new Error("No vendor found with this Id");
        }
        data.map(async (x) => {
          const newGallary = new gallarySchema({
            vendorId: id,
            image: x,
          });
          await newGallary.save();
        });
        return "successfully uploaded";
      } catch (err) {
        return err;
      }
    },
    vendorGallaryDelete: async (imageLink) => {
      try {
        const image = imageLink.split("/")[4];
        if (imageLink) {
          const feild = "image";
          await galaryImageDelete(imageLink, gallarySchema, feild);
        }
        const results = await gallarySchema.findOneAndDelete({
          image: imageLink,
        });
        if (!results) {
          return new Error("No image found with this image link");
        }
        return "successfully deleted";
      } catch (err) {
        return err;
      }
    },
    vendorSocialMedia: async (data, id) => {
      try {
        const vendor = await socialMediaSchemas.findOne({ vendorId: id });
        if (!vendor) {
          const account = new socialMediaSchemas({
            vendorId: id,
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
        } else {
          const condition = {};
          for (const key in data) {
            // if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
            if (data[key]) {
              condition[key] = data[key];
            }
          }
          const xyz = await socialMediaSchemas.findOneAndUpdate(
            { vendorId: id },
            { $set: condition },
            { new: true }
          );
          return xyz;
        }
      } catch (err) {
        return err;
      }
    },
    businessDetailsUpdate: async (data) => {
      try {
        const vendor = await vendorBusinessSchema.findOne({ _id: data.id });
        if (!vendor) {
          return new Error("vendor id galat hai");
        }
        const condition = {};
        if (data.name) {
          condition.name = data.name;
        }
        if (data.area) {
          condition.area = data.area;
        }
        if (data.categoryId) {
          condition.categoryId = data.categoryId;
        }
        if (data.userId) {
          condition.userId = data.userId;
        }
        if (data.rating) {
          condition.rating = data.rating;
        }
        if (data.esteblish) {
          condition.yearOfEsteblish = data.esteblish;
        }

        const xyz = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: vendor.id },
          { $set: condition },
          { new: true }
        );
        return xyz;
      } catch (err) {
        return err;
      }
    },
    addressUpdate: async (data, id, searchAddress) => {
      try {
        let localArea = data.city + " " + data.area;
        const business = await vendorBusinessSchema.findOne({ _id: id });
        if (!business) {
          return new Error("business id galat hai");
        }
        const condition = {};
        for (const key in data) {
          if (data[key] !== undefined) {
            condition[key] = data[key];
          }
        }
        const result = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: business.id },
          {
            $set: {
              address: condition,
              area: localArea,
              searchAddress: searchAddress,
            },
          },
          { new: true }
        );
        if (data.latituse && data.longitude) {
          await vendorBusinessSchema.findByIdAndUpdate(
            { _id: business.id },
            { $set: { latituse: data.latituse, longitude: data.longitude } },
            { new: true }
          );
        }
        return result;
      } catch (err) {
        return err;
      }
    },
    paymentTypeUpdate: async (data, id) => {
      try {
        const business = await vendorBusinessSchema.findById({ _id: id });
        if (!business) {
          return new Error("vendor id galat hai");
        }

        const result = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: business.id },
          { $set: { paymentType: data.paymentType } },
          { new: true }
        );
        return result;
      } catch (err) {
        return err;
      }
    },
    vendorDetailsUpdate: async (data, businessId) => {
      try {
        const business = await vendorBusinessSchema.findById({
          _id: businessId,
        });
        if (!business) {
          return new Error("vendor id galat hai");
        }
        let condition = {};
        for (const key in data) {
          if (data[key] !== undefined) {
            condition[key] = data[key];
          }
        }
        const result = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: business.id },
          { $set: condition },
          { new: true }
        );
        console.log(result, "this is fucking result");
        return result;
      } catch (err) {
        return err;
      }
    },
    // reviewssssss
    reviewByBusinessId: async (data) => {
      try {
        const condition = {};
        if (data.sort === "Heighest") {
          condition.rating = -1;
        }
        if (data.sort === "Lowest") {
          condition.rating = 1;
        }
        if (data.sort === "New") {
          condition.createdAt = -1;
        }

        const reviewsData = await reviewsSchema
          .find({ vendorId: data.businessId }, { response: 0 })
          .sort(condition)
          .populate("userId");
        return reviewsData;
      } catch (err) {
        return err.message;
      }
    },
    reviewByUser: async (data) => {
      try {
        const sex = await reviewsSchema
          .findOne({ vendorId: data.vid, userId: data.userId })
          .sort({ createdAt: -1 });
        if (!sex) {
          const abc = new reviewsSchema({
            vendorId: data.vid,
            review: data.review,
            rating: data.rating,
            userId: data.userId,
          });
          const xyz = await abc.save();
          return xyz;
        } else {
          await reviewsSchema.findOneAndUpdate(
            { vendorId: data.vid, userId: data.userId },
            { $set: { review: data.review, rating: data.rating } },
            { new: true }
          );
        }
      } catch (err) {
        return err;
      }
    },
    myReviewOfVendor: async (data) => {
      try {
        const abc = await reviewsSchema
          .findOne({ vendorId: data.businessId, userId: data.userId })
          .sort({ createdAt: -1 });
        return abc;
      } catch (err) {
        return err;
      }
    },
    contactDetailUpdate: async (data) => {
      try {
        if (!data.businessId) {
          const business = await vendorBusinessSchema.findOne({
            userId: data.venderId,
          });
          data.businessId = business.id;
        }
        const user = await vendorBusinessSchema.findOne({
          userId: data.venderId,
        });
        const result = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: data.businessId },
          {
            $set: {
              contactPersonName: data.contactName,
              designation: data.designation,
              whatsappNumber: data.whatsappNumber,
              mobileNumber: data.mobileNumber,
              email: data.email,
            },
          },
          { new: true }
        );
        return result;
      } catch (err) {
        return err;
      }
    },
    timingDetailUpdate: async (data, id) => {
      try {
        const abc = await vendorBusinessSchema.findById({ _id: id });
        const result = await vendorBusinessSchema.findByIdAndUpdate(
          { _id: id },
          { timing: data },
          { new: true }
        );
        return result;
      } catch (err) {
        return err;
      }
    },
    nameUpdateRequest: async (data) => {
      try {
        const request = new nameUpdateRequest({
          name: data.requestedName,
          businessId: data.businessId,
          userId: data.venderId,
        });
        await request.save();
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
        const business = await vendorBusinessSchema
          .findOne({ _id: body.businessId })
          .populate("packagePurchaseId");
        if (
          !business?.packagePurchaseId ||
          business?.packagePurchaseId?.expireDate < new Date(Date.now())
        ) {
          return new Error("Package not found or expire with this business");
        }
        if (body.clickType === "SOCIAL") {
          if (
            business?.packagePurchaseId?.package?.socialMediaCharges >
            business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet:
                    -business?.packagePurchaseId?.package?.socialMediaCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Social Media Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else if (body.clickType === "WEBSITE") {
          if (
            business?.packagePurchaseId?.package?.websiteCharges >
            business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet: -business?.packagePurchaseId?.package?.websiteCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Website Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else if (body.clickType === "BESTDEAL") {
          if (
            business?.packagePurchaseId?.package?.bestDealCharges >
            business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet:
                    -business?.packagePurchaseId?.package?.bestDealCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Best Deal Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else if (body.clickType === "CALL") {
          if (
            business?.packagePurchaseId?.package?.callCharges > business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet: -business?.packagePurchaseId?.package?.callCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Call Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else if (body.clickType === "DIRECTION") {
          if (
            business?.packagePurchaseId?.package?.directionCharges >
            business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet:
                    -business?.packagePurchaseId?.package?.directionCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Direction Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else if (body.clickType === "CHAT") {
          if (
            business?.packagePurchaseId?.package?.chatCharges > business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet: -business?.packagePurchaseId?.package?.chatCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Chat Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else if (body.clickType === "INQUERY") {
          if (
            business?.packagePurchaseId?.package?.inqueryCharges >
            business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet: -business?.packagePurchaseId?.package?.inqueryCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Inquery Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        } else {
          if (
            business?.packagePurchaseId?.package?.otherCharges >
            business?.wallet
          ) {
            return new Error("Vendor haven't enough balance in wallet.");
          }
          if (business.userId != body.userId) {
            const condition = {};
            condition.vendorId = business.userId;
            for (const key in body) {
              if (body[key] !== undefined) {
                condition[key] = body[key];
              }
            }
            const click = new clickSchema(condition);
            const result = await click.save();
            const sex = await vendorBusinessSchema.findByIdAndUpdate(
              { _id: body.businessId },
              {
                $inc: {
                  wallet: -business?.packagePurchaseId?.package?.otherCharges,
                },
              },
              { new: true }
            );
            const passbook = new passbookSchema({
              businessId: body.businessId,
              userId: body.userId,
              title: "Other Charges",
              amount: business?.packagePurchaseId?.package?.socialMediaCharges,
              transactionType: "DEBIT",
              availableBalance: sex?.wallet,
            });
            await passbook.save();
            return result;
          } else {
            return new Error("You can't Increase click on your own business");
          }
        }
      } catch (err) {
        return err;
      }
    },
    businessDashboardVendor: async (body) => {
      try {
        const clicks = await clickSchema.find({ businessId: body.bid });
        const totalCount = await clickSchema
          .find({ businessId: body.bid })
          .countDocuments();

        const social = [];
        const call = [];
        const bestDeal = [];
        const webSite = [];
        const direction = [];
        clicks.map((x) => {
          if (x.clickType === "SOCIAL") {
            social.push(x);
          }
          if (x.clickType === "WEBSITE") {
            webSite.push(x);
          }
          if (x.clickType === "BESTDEAL") {
            bestDeal.push(x);
          }
          if (x.clickType === "CALL") {
            call.push(x);
          }
          if (x.clickType === "DIRECTION") {
            direction.push(x);
          }
        });
        socialPercentage = parseFloat((social.length / totalCount) * 100);
        webSitePercentage = parseFloat((webSite.length / totalCount) * 100);
        callPercentage = parseFloat((call.length / totalCount) * 100);
        bestDealPercentage = parseFloat((bestDeal.length / totalCount) * 100);
        directionPercentage = parseFloat((direction.length / totalCount) * 100);

        const count = {
          social: social.length,
          webSite: webSite.length,
          call: call.length,
          bestDeal: bestDeal.length,
          direction: direction.length,
          allLeads: totalCount,
        };
        //add count in return object
        return {
          socialPercentage,
          webSitePercentage,
          callPercentage,
          bestDealPercentage,
          directionPercentage,
          count,
        };
      } catch (err) {
        return err;
      }
    },
    dashboardCallLeadsVendor: async (body) => {
      try {
        const callLeads = await clickSchema
          .find({ businessId: body?.bid, clickType: body.type })
          .populate("userId", { createdAt: 0 })
          .populate("businessId", { createdAt: 0, timing: 0 })
          .skip((body.page - 1) * body.limit)
          .limit(body.limit);
        return callLeads;
      } catch (err) {
        return err;
      }
    },
    dashboardAllLeads: async (body) => {
      try {
        if (!body.businessId) {
          var businessNameAndAmount = await vendorBusinessSchema
            .findOne(
              { userId: body.userId },
              { wallet: 1, categoryName: 1, address: 1 }
            )
            .sort({ createdAt: 1 });
          body.businessId =
            businessNameAndAmount?._id ?? "64ca05ef24a527edc66a0ea1";
        } else {
          var businessNameAndAmount = await vendorBusinessSchema.findById(
            { _id: body.businessId },
            { wallet: 1, categoryName: 1, address: 1 }
          );
        }
        const condition = {};
        condition.businessId = body.businessId;
        if (body.startDate && !body.endDate) {
          return "please enter end date as well";
        }
        if (body.startDate) {
          const edate = new Date(body.endDate.split("/").reverse().join("/"));
          const sdate = new Date(body.startDate.split("/").reverse().join("/"));
          condition.createdAt = { $gte: sdate, $lte: edate }; //I'll fix it soon
        }
        if (body.isNew) {
          condition.isNaya = true;
        }
        if (body.isRead) {
          condition.isRead = true;
        }
        // const callLeads = await clickSchema.find(condition).populate("userId",{createdAt:0}).popula  te("businessId",{timing:0,createdAt:0}).skip((body.page -1)*body.limit).limit(body.limit);
        const callLeads = await clickSchema
          .find(condition)
          .sort({ createdAt: -1 })
          .populate("userId", { createdAt: 0 })
          .populate("businessId", { timing: 0, createdAt: 0 });
        return { businessNameAndAmount, callLeads };
      } catch (err) {
        return new Error(err);
      }
    },
    dashboardSingleLeadInfo: async (body) => {
      try {
        const callLeads = await clickSchema
          .findByIdAndUpdate(
            { _id: body.lid },
            { $set: { isNaya: false, isRead: true } },
            { new: true }
          )
          .populate("userId")
          .populate("businessId", {
            timing: 0,
            uniqueId: 0,
            profileImage: 0,
            userId: 0,
            __v: 0,
            _id: 0,
            area: 0,
            designation: 0,
          });
        return callLeads;
      } catch (err) {
        return err;
      }
    },
    //===================== Apis only for Vender side ==================

    suggestionOfVender: async (data) => {
      try {
        const abc = new suggestionsSchema({
          vendorId: data.vendorId,
          subject: data.subject,
          description: data.description,
        });
        const xyz = await abc.save();
        return xyz;
      } catch (err) {
        return err;
      }
    },
    detailsofPackage: async (skip, limit) => {
      try {
        const business = await vendorBusinessSchema.find({}, { packageId: 1 });
        const id = business[0].packageId._id;
        console.log(id);
        const result = await packageSchame
          .find({ _id: { $ne: id }, status: true })
          .skip(skip)
          .limit(limit);
        return {
          totalData: result.length,
          totalPage: Math.ceil((result.length / limit).toFixed()),
          data: result,
        };
      } catch (err) {
        return err;
      }
    },
    currentPackageDetails: async (body) => {
      try {
        if (!body.businessId) {
          const business = await vendorBusinessSchema
            .findOne({ userId: body.userId })
            .sort({ createdAt: 1 });
          body.businessId = business._id;
          body.packageId = business?.packageId;
        } else {
          const business = await vendorBusinessSchema
            .findOne({ _id: businessId })
            .sort({ createdAt: 1 });
          body.packageId = business?.packageId;
        }

        const packageDetails = await pruchasedPackageSchema
          .findOne({ businessId: body.businessId, packageId: body.packageId })
          .sort({ createdAt: 1 });
        if (!packageDetails) {
          return "No package found with this user";
        }
        return packageDetails;
      } catch (err) {
        return err;
      }
    },
    detailsSinglePackagebyId: async (pid) => {
      try {
        const package = await packageSchame.findById({ _id: pid });
        const packageDetails = package.packageDetalis;
        const amount = package.packageAmount;
        const gst = (amount * 18) / 100;
        const totalAmount = amount + gst;

        return { packageDetails, amount, gst, totalAmount };
      } catch (err) {
        return err;
      }
    },
    support: async (data) => {
      try {
        const user = await userSchema.findById(
          { _id: data.userId },
          { name: 1 }
        );
        const business = await vendorBusinessSchema
          .findOne(
            { userId: data.userId },
            { companyName: 1, uniqueId: 1, name: 1 }
          )
          .sort({ createdAt: -1 });

        if (!user) {
          return new Error("No user found with this Id");
        }
        let poplu = user?.name.split(" ").join("%20");
        let sexa = business?.companyName.split(" ").join("%20");
        if (data.type === "business") {
          const number = process.env.WHATSAPPNUMBER;
          const massage = `Hello%20Team%2C%0AI%20want%20to%20change%20something%20in%20my%20business%20profile%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`;
          return { number, massage };
        }
        if (data.type === "leads") {
          const number = process.env.WHATSAPPNUMBER;
          const massage = `Hello%20Team%2C%0AI%20want%20to%20discuss%20something%20about%20*Leads*%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`;
          return { number, massage };
        }
        if (data.type === "payment") {
          const number = process.env.WHATSAPPNUMBER;
          const massage = `Hello%20Team%2C%0AI%20want%20to%20discuss%20something%20about%20*Payment*%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`;
          return { number, massage };
        }
        if (data.type === "other") {
          const number = process.env.WHATSAPPNUMBER;
          const massage = `Hello%20Team%2C%0AI%20want%20to%20discuss%20something%20about%20*Other*%2C%0AID%3A'${business?.uniqueId}'%0ABusiness%20Name%3A%20'${sexa}'%0AOwner%3A%20'${poplu}'%0A`;
          return { number, massage };
        }
      } catch (err) {
        return err;
      }
    },

    askForRating: async (body) => {
      try {
        if (!body.businessId) {
          const business = await vendorBusinessSchema
            .findOne({ userId: body.userId })
            .sort({ createdAt: 1 });
          body.businessId = business?._id;
        }
        const user = await userSchema.findOne({
          mobile_number: body.customerNumber,
        });
        if (!user) {
          return new Error(
            "No user found with this number Please enter registered number"
          );
        }
        const vendor = await vendorBusinessSchema.findOne(
          { _id: body.businessId },
          { companyName: 1, name: 1 }
        );
        const title = "Please rate me";
        const description = `Hey ${body.customerName}, </br> please rate me on my profile, it will help me to grow my business. </br> best regards ${vendor.companyName}`;

        const notification = new notificationSchema({
          title: title,
          description: description,
          userId: user._id,
          image: BASEURL + "images/i/defaultuser.jpg",
          from: vendor.name,
        });
        await notification.save();
        return "notification send";
      } catch (err) {
        return err;
      }
    },
    passbookListing: async (body) => {
      try {
        if (!body.businessId) {
          const business = await vendorBusinessSchema
            .findOne({ userId: body.userId })
            .sort({ createdAt: 1 });
          body.businessId = business?._id;
        }
        const condition = {};
        condition.businessId = body.businessId;
        if (body.startDate && !body.endDate) {
          return "please enter end date as well";
        }
        if (body.startDate) {
          const edate = new Date(body.endDate.split("/").reverse().join("/"));
          const sdate = new Date(body.startDate.split("/").reverse().join("/"));
          condition.createdAt = { $gte: sdate, $lte: edate }; //I'll fix it soon
        }
        const passbook = await passbookSchema.aggregate([
          { $match: condition },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              result: { $push: "$$ROOT" },
            },
          },
          {
            $sort: { _id: -1 },
          },
        ]);
        const balance = await vendorBusinessSchema.findOne(
          { _id: body.bisinessId },
          { wallet: 1 }
        );
        return passbook;
      } catch (err) {
        return err;
      }
    },
    businessReviewList: async (body) => {
      try {
        const reviews = await reviewsSchema
          .find({ vendorId: body.businessId })
          .populate("userId", { createdAt: 0 });
        return reviews;
      } catch (err) {
        return err;
      }
    },
    responseReviewById: async (body) => {
      try {
        const business = await vendorBusinessSchema.findById(
          { _id: body.businessId },
          { companyName: 1, profileImage: 1 }
        );
        const obj = {
          companyName: business.companyName,
          profileImage: business.profileImage,
          response: body.response,
        };

        const response = await reviewsSchema.findByIdAndUpdate(
          { _id: body.reviewId },
          { $set: { response: obj } },
          { new: true }
        );
        // const response = await reviewsSchema.findByIdAndUpdate({_id:body.reviewId},{$push:{response:obj}},{new:true});
      } catch (err) {
        return err;
      }
    },

    //add service or subCategories by businessId

    addSubCategoryByBusinessId: async (businessId, subCategories) => {
      try {
        const check = await vendorBusinessSchema.findById(
          { _id: businessId },
          { services: 1 }
        );
        let data = check.services.includes(subCategories);
        if (!data) {
          check.services.push(subCategories);
          const poplu = await vendorBusinessSchema.findByIdAndUpdate(
            { _id: businessId },
            { $set: { services: check.services } },
            { new: true }
          );
          return poplu;
        } else {
          return new Error("service name is already exist!");
        }
      } catch (asas) {
        return asas;
      }
    },

    //===================== Apis only for State and City ==================

    getState: async () => {
      try {
        const state = await State.find({}).sort({ name: 1 });
        return state;
      } catch (err) {
        return err;
      }
    },
    getCity: async (body) => {
      try {
        if (!body.stateId) {
          return new Error("please enter state first");
        }
        const condition = {};
        condition.state = body.stateId;
        if (body.search) {
          condition.name = { $regex: body.search, $options: "i" };
        }

        const city = await City.find(condition).sort({ name: 1 });
        return city;
      } catch (err) {
        return err;
      }
    },
    getLocality: async (body) => {
      try {
        if (!body.cityId) {
          return new Error("please enter city first");
        }
        const condition = {};
        condition.city = body.cityId;
        if (body.search) {
          condition.name = { $regex: body.search, $options: "i" };
        }
        //Schema change krna hai bus
        const city = await Locality.find(condition).sort({ name: 1 });
        return city;
      } catch (err) {
        return err;
      }
    },
    searchLocation: async (search) => {
      try {
        const name = { $regex: search, $options: "i" };
        //  const states = await State.find({name:query}).limit(5);
        //  const cities = await City.find({name:query}).limit(5);
        //  const localities = await Locality.find({name:query}).limit(5);

        //      const location = await Locality.aggregate([
        //   {
        //     $match: {
        //       $or: [{ name:name }, { cityName:name },{stateName:name}],
        //       $lookup:{
        //         from:"City",
        //         localfeild:"sdfasdf",
        //         forigenfeild:" dflsadf",
        //         as:"data"
        //       }
        //     },
        //   },
        // ]);

        var location = await Locality.find({
          $or: [{ name: name }, { cityName: name }, { stateName: name }],
        });
        if (location.length < 1) {
          location = await City.find({
            $or: [{ stateName: name }, { name: name }],
          });
        }
        return location;
      } catch (err) {
        return err;
      }
    },
    deleteVendor: async (id) => {
      try {
        const vendor = await vendorBusinessSchema.findByIdAndDelete(id);
        console.log("vendor", vendor);
        if (!vendor) {
          return new Error("Vendor not found");
        }
        const vendorDelete = Promise.all([
          reviewsSchema.deleteMany({
            vendorId: new mongoose.Types.ObjectId(id),
          }),
          socialMediaSchemas.findOneAndDelete({
            vendorId: new mongoose.Types.ObjectId(id),
          }),
          clickSchema.deleteMany({ vendorId: new mongoose.Types.ObjectId(id) }),
          gallarySchema.deleteMany({
            vendorId: new mongoose.Types.ObjectId(id),
          }),
        ]);
        await vendorDelete;
        console.log(vendorDelete);
        // suggestionsSchema.deleteMany({ vendorId: mongoose.Types.ObjectId(id) })
        // timingSchema.deleteMany({ vendorId: mongoose.Types.ObjectId(id) })
        return "Vendor delete sucessfully";
      } catch (err) {
        return err;
      }
    },
    listBanner: async (body) => {
      try {
        const banner = await vendorBusinessSchema
          .find(
            { $and: [{ _id: { $ne: id } }, { $max: "$quantity" }] },
            { _id: 1, bannerImage: 1 }
          )
          .skip(skip)
          .limit(limit);
        if (!banner) {
          return new Error("banners not found");
        }
        return banner;
      } catch (err) {
        return err;
      }
    },
    createPackageOrder: async (payload) => {
      try {
        const vendor = await vendorBusinessSchema.findById(payload.v_id);
        let optionAmount = 0;
        let packageOptions = [];
        console.log(vendor);
        if (!vendor) {
          return new Error("vendor not found");
        }
        const package = await packageSchame.findById(payload.packageId);
        if (!package) {
          return new Error("package not found");
        }
        console.log(payload?.optionId.length);
        if (payload?.optionId.length) {
          packageOptions = await Promise.all(
            payload.optionId.map((id) => optionsSchema.findById(id))
          );
          optionAmount = packageOptions.reduce((acc, cv) => acc + cv.amount, 0);
        }
        let totalAmount = package.packageAmount + optionAmount;
        let gstAmount = totalAmount * process.env.GST;
        let discount = totalAmount * process.env.DISCOUNT;
        let paidAmount = totalAmount + gstAmount - discount;

        console.log(
          "PackageOptions",
          totalAmount,
          gstAmount,
          discount,
          paidAmount
        );
        const generateOrderId = () => {
          const timestamp = Date.now();
          const randomId = Math.floor(Math.random() * 1000);
          return `${timestamp}-${randomId}`;
        };
        const result = await pruchasedPackageSchema.create({
          userId: vendor.userId,
          businessId: vendor._id,
          packageId: package._id,
          amount: package.packageAmount + optionAmount,
          orderId: generateOrderId(),
          packageOptions: payload.optionId || [],
          paidAmount,
          gstAmount,
          discount,
          package: { package, packageOptions: packageOptions || [] },
          paymentStatus: "PENDING",
        });
        return result;
        // return {};
      } catch (error) {
        return error;
      }
    },
    purchasePackage: async (payload) => {
      try {
        let type = payload.type.trim().toUpperCase();
        let mode = "";
        let paymentDetails = "";
        console.log(new mongoose.Types.ObjectId(payload.id));
        const packageRecord = await pruchasedPackageSchema.findOne({
          orderId: payload.orderId,
          paymentStatus: new RegExp("PENDING", "i"),
        });
        console.log("packageRecord", packageRecord);
        if (!packageRecord) {
          return new Error("data not found");
        }
        const month =
          new Date().getMonth() +
          packageRecord?.package?.package?.packageDuration;
        const expireDate = new Date().setMonth(month);
        if (type === "CASH") {
          mode = "CASH";
          paymentDetails = "";
        } else if (type === "CHEQUE") {
          mode = "CHEQUE";
          paymentDetails = payload.paymentDetails;
        } else return new Error("provide valid payment mode");
        const isUpdated = await pruchasedPackageSchema.findByIdAndUpdate(
          payload.id,
          { paymentStatus: "DONE", expireDate: new Date(expireDate) },
          { new: true }
        );
        if (isUpdated) {
          const payment = await paymentSchema.create({
            userId: isUpdated.userId,
            businessId: isUpdated.businessId,
            amount: isUpdated.amount,
            paidAmount: isUpdated.paidAmount,
            orderId: isUpdated.orderId,
            mode,
            paymentDetails,
            productName: "Purchased Package",
            paymentStatus: "PAID",
          });
          await invoiceSchema.create({
            businessId: payment.businessId,
            payment: payment._id,
            is_active: true,
          });
          if (!payment) {
            return new Error("Payment not initiated successfully!");
          }
          return { payment };
        }
        return result;
      } catch (error) {
        return error;
      }
    },
    listTopVendor: async () => {
      try {
        const vendor = await vendorBusinessSchema
          .find({}, { bannerImage: 1, rating: 1, _id: 1 })
          .sort({ rating: -1 })
          .skip(0)
          .limit(5);
        // .find(
        //   { $max: { rating: new Date("2013-09-30") } }
        // )
        // .skip(skip)
        // .limit(limit);
        if (!vendor.length) {
          return new Error("banners not found");
        }
        return vendor;
      } catch (err) {
        return err;
      }
    },
  };
} catch (e) {
  log.error(e);
}
