const appDataSchema = require('./appDataSchema.js');
const bannerSchema = require('../admin/bannerSchema.js');
const banner3Schema = require('../admin/banner3Schema.js');
const servicesSchema = require('../services/serviceSchema.js');
const categorySchema = require('../services/categorySchema.js');
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    aboutUs: async () => {
      try {
        const data = await appDataSchema.findOne({},{aboutUs:1}).sort({createdAt:-1})
        return data.aboutUs;
      } catch (err) {
        return err;
      }
    },
    privacyAndPolicy: async () => {
      try {
        const data = await appDataSchema.findOne({},{privacyAndPolicy:1}).sort({createdAt:-1})
        return data.privacyAndPolicy;
      } catch (err) {
        return err;
      }
    },
    termAndCondition: async () => {
      try {
        const data = await appDataSchema.findOne({},{termAndCondition:1}).sort({createdAt:-1})
        return data.termAndCondition;
      } catch (err) {
        return err;
      }
    },
    fAQ: async () => {
      try {
        const data = await appDataSchema.findOne({},{FAQ:1}).sort({createdAt:-1})
        return data.FAQ;
      } catch (err) {
        return err;
      }
    },
    homeDataApi: async () => {
      try {
        const mainBanners = await bannerSchema.find();
        const threeBanners = await banner3Schema.find();
        const allServices = await servicesSchema.find();
        const categories = await Promise.all(allServices.map(async(x)=>{
        const serviceName = `${x.name}`
        const categoryName = await categorySchema.find({serviceId:x.id});
        return {serviceName,categoryName}
        }));

        return {mainBanners,threeBanners,allServices,categories}
      } catch (err) {
        return err;
      }
    },

    addAppData: async (data) => {
        try {
        const doc = new appDataSchema({
            aboutUs: data.aboutUs,
            privacyAndPolicy: data.privacyAndPolicy,
            termAndCondition: data.termAndCondition,
            FAQ:data.fAQ
        })
        const result = await doc.save();
        return result
        } catch (err) {
          return err;
        }
      },
    
  };
} catch (e) {
  log.error(e);
}
