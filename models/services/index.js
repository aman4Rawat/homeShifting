const serviceSchema = require('./serviceSchema.js');
const categorySchema = require('./categorySchema.js');
const mongoose = require("mongoose");
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    createService: async(data)=>{
      try {
          const service = serviceSchema({
            image: BASEURL+data.image,
            name: data.name
          });
          await service.save();
          return "Service Created Successfully";
      } catch (err) {
        return err;
      }
    },
    updateService: async(id,data)=>{
      try {
          await serviceSchema.findByIdAndUpdate({_id:id},{$set:{data}},{new:true});
          return "Service Updated Successfully";
      } catch (err) {
        return err;
      }
    },
    allServices: async(body)=>{
      try {
        const page = body.page || 1;
        const limit = body.limit|| 8;
          const data = await serviceSchema.find().skip((page-1)*limit).limit(limit);
          return data;
      } catch (err) {
        return err;
      }
    },
    deleteService: async(id)=>{
      try {
       const result =  await serviceSchema.findByIdAndDelete({_id:id});
          return result;
      } catch (err) {
        return err;
      }
    },
    createCategory: async(data)=>{
      try {
        const service = await serviceSchema.findById({_id:data.serviceId});
        if(!service){return new Error("No service found")}
          const category = new categorySchema({
            image: BASEURL+data.image,
            name: data.name,
            serviceId:data.serviceId,
            serviceName: service.name
          });
          await category.save();
          return "Category Created Successfully";
      } catch (err) {
        return err;
      }
    },
    updateCategory: async(id,data)=>{
      try {
          await categorySchema.findByIdAndUpdate({_id:id},{$set:{data}},{new:true});
          return "Category Updated Successfully";
      } catch (err) {
        return err;
      }
    },
    allCategories: async(body)=>{
      try {
        const page = body.page || 1;
        const limit = body.limit|| 8;
          const data = await categorySchema.find().skip((page-1)*limit).limit(limit);
          return data;
      } catch (err) {
        return err;
      }
    },
    deletecategory: async(id)=>{
      try {
       const result =  await categorySchema.findByIdAndDelete({_id:id});
          return result;
      } catch (err) {
        return err;
      }
    },
    categoriesbyservice: async(body)=>{
      try {
        const page = body.page || 1;
        const limit = body.limit|| 8;
        const id = body.serviceId
          const data = await categorySchema.find({serviceId:id}).skip((page-1)*limit).limit(limit);
          return data;
      } catch (err) {
        return err;
      }
    },
    serviceAndCategoryAll: async()=>{
      try {
          const data = await serviceSchema.find();
          const abc = await Promise.all(data.map(async(x)=>{
            const sunCategory = await categorySchema.find({serviceId:x.id})
              const category = sunCategory.map((xx)=>{
                const wefwef = {
                  categoryId: xx.id,
                  categoryName: xx.name,
                  image: xx.image
                }
                return wefwef
              })
            return {
              serviceId:x.id,
              serviceName: x.name,category}
          }))
          return abc;
      } catch (err) {
        return err;
      }
    },


  };
} catch (e) {
  log.error(e);
}
