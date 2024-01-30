const { serviceSchema, subCategory } = require("./serviceSchema.js");
const categorySchema = require("./categorySchema.js");
const vendorBusinessSchema = require("../vendor/vendorBusinessSchema.js");
const mongoose = require("mongoose");
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    createService: async (data) => {
      try {
        const service = serviceSchema({
          image: BASEURL + data.image,
          name: data.name,
        });
        await service.save();
        return "Service Created Successfully";
      } catch (err) {
        return err;
      }
    },
    updateService: async (id, data) => {
      try {
        await serviceSchema.findByIdAndUpdate(
          { _id: id },
          { $set: data },
          { new: true }
        );
        return "Service Updated Successfully";
      } catch (err) {
        return err;
      }
    },
    allServices: async (body) => {
      try {
        const page = body.page || 1;
        const limit = body.limit || 8;
        const data = await serviceSchema
          .find({})
          .skip((page - 1) * limit)
          .limit(limit);
        const count = await serviceSchema.find({}).countDocuments();
        const totalPages = Math.ceil(count / limit);
        return { data, totalPages };
      } catch (err) {
        return err;
      }
    },
    deleteService: async (id) => {
      try {
        const categories = await categorySchema.find({ serviceId: id });
        if (categories.length > 0) {
          return new Error("First delete all categories of this service");
        }
        const result = await serviceSchema.findByIdAndUpdate(
          { _id: id },
          { $set: { isDeleted: true } },
          { new: true }
        );
        return result;
      } catch (err) {
        return err;
      }
    },
    createCategory: async (data) => {
      try {
        const service = await serviceSchema.findById({ _id: data.serviceId });
        if (!service) {
          return new Error("No service found");
        }
        const category = new categorySchema({
          image: BASEURL + data.image,
          name: data.name,
          serviceId: data.serviceId,
          serviceName: service.name,
        });
        await category.save();
        return "Category Created Successfully";
      } catch (err) {
        return err;
      }
    },
    updateCategory: async (id, data) => {
      try {
        console.log(id, "this is id.....", data, "this is dataaaaaaaa");
        const abc = await categorySchema.findByIdAndUpdate(
          { _id: id },
          { $set: data },
          { new: true }
        );
        return { msg: "Category Updated Successfully", abc };
      } catch (err) {
        return err;
      }
    },
    allCategories: async (body) => {
      try {
        let totalData = 0;
        let data = [];
        if (body.limit) {
          const skip = body.skip || 0;
          const limit = body.limit || 10;
          data = await categorySchema
            .find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
          totalData = await categorySchema.find({}).countDocuments();
        } else {
          data = await categorySchema.find({}).sort({ createdAt: -1 });
          totalData = await categorySchema.find({}).countDocuments();
        }
        return { data, totalData };
      } catch (err) {
        return err;
      }
    },
    deletecategory: async (id) => {
      try {
        const result = await categorySchema.findByIdAndDelete({ _id: id });
        return result;
      } catch (err) {
        return err;
      }craetevenderprofile
    },
    categoriesbyservice: async (body) => {
      try {
        const page = body.page || 1;
        const limit = body.limit || 8;
        const id = body.serviceId;
        const data = await categorySchema
          .find({ serviceId: id })
          .skip((page - 1) * limit)
          .limit(limit);
        return data;
      } catch (err) {
        return err;
      }
    },
    serviceAndCategoryAll: async () => {
      try {
        const data = await serviceSchema.find();
        const abc = await Promise.all(
          data.map(async (x) => {
            const sunCategory = await categorySchema.find({ serviceId: x.id });
            const category = sunCategory.map((xx) => {
              const wefwef = {
                categoryId: xx.id,
                categoryName: xx.name,
                image: xx.image,
              };
              return wefwef;
            });
            return {
              serviceId: x.id,
              serviceName: x.name,
              category,
            };
          })
        );
        return abc;
      } catch (err) {
        return err;
      }
    },
    searchAll: async (body) => {
      try {
        const condition = {};
        if (body.search) {
          condition.companyName = { $regex: new RegExp(body.search, "i") };
        } //condition.name
        if (body.location) {
          condition.searchAddress = { $regex: new RegExp(body.location, "i") };
        }
        const vendor = await vendorBusinessSchema.find(condition);
        const category = await categorySchema.find({
          name: { $regex: new RegExp(body.search, "i") },
        });
        return { vendor, category };
      } catch (err) {
        return err;
      }
    },

    //need to change

    // searchAll: async (body) => {
    //   try {

    //   // if(body.search && !body.city){
    //   //   const search = body.search;
    //   //   const service = await serviceSchema.aggregate([
    //   //     {
    //   //       $match: { "name": { $regex: new RegExp(search, "i") } }
    //   //     },
    //   //     {
    //   //       $project: {
    //   //         isDeleted: 1,
    //   //         _id: 1,
    //   //         image: 1,
    //   //         name: 1,
    //   //         is_active: 1,
    //   //         type: "Service"
    //   //       }
    //   //     },
    //   //   ]);
    //   //   const category = await categorySchema.aggregate([
    //   //     {
    //   //       $match: { "name": { $regex: new RegExp(search, "i") } }
    //   //     },
    //   //     {
    //   //       $project: {
    //   //         isDeleted: 1,
    //   //         _id: 1,
    //   //         image: 1,
    //   //         name: 1,
    //   //         is_active: 1,
    //   //         serviceId:1,
    //   //         serviceName:1,
    //   //         type: "Category"
    //   //       }
    //   //     }
    //   //   ]);
    //   //   return {service, category};
    //   // }

    //     const category = await categorySchema.find( { "name" : { $regex : new RegExp(body.search, "i") } } );
    //     return category;
    //   } catch (err) {
    //     return err;
    //   }
    // },

    // Only Sub category mood off
    createSubCategory: async (sex, id) => {
      try {
        const madarchod = subCategory({
          name: sex,
          category: id,
        });
        await madarchod.save();
        return "subCategory Created Successfully";
      } catch (err) {
        if (err.code === 11000) {
          return new Error("Name Already Exist");
        }
        return err;
      }
    },
    updateSubCategory: async (sex, id) => {
      try {
        const fuck = await subCategory.findById({ _id: id });
        if (!fuck) {
          return new Error("no data found with this id");
        }
        const fuddi = {};
        if (sex.name) {
          fuddi.name = sex.name;
        }
        if (sex.status) {
          fuddi.is_active = sex.status;
        }
        if (sex.delete) {
          (fuddi.is_active = false), (fuddi.isDeleted = true);
        }
        if (sex.categoryId) {
          fuddi.category = sex.categoryId;
        }
        const porn = await subCategory.findByIdAndUpdate(
          { _id: id },
          { $set: fuddi },
          { new: true }
        );
        return porn;
      } catch (err) {
        return err;
      }
    },
    allSubCategories: async (choot) => {
      try {
        const page = choot.fuck || 1;
        const limit = choot.sex || 10;
        const lawda = {};
        lawda.is_active = true;
        if (choot.boob) {
          lawda.name = { $regex: new RegExp(choot.boob, "i") };
        }

        const result = await subCategory
          .find(lawda)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("category");
        const sex = await subCategory.find(lawda).countDocuments();
        const totalPages = Math.ceil(sex / limit);
        return { result, totalPages };
      } catch (err) {
        return err;
      }
    },
  };
} catch (e) {
  log.error(e);
}
