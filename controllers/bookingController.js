const CabSBookingSchema = require("../models/bookingSchema.js");
const ApiBookingSchema = require("../models/bookingSchema.js");
const airTrafic = require("../models/airTraficSchema.js");
const Users = require("../models/Users.js");
module.exports = {
  bookCab: async (req, res) => {
    try {
    const body = {
      from:req.body.form,
      to:req.body.to,
      date: req.body.date,
      carType:req.body.carType,
      phone:req.body.phone
    };
    const userId = req.userId;
    const user = await Users.findById({_id:userId},{phone:1});

    const book = new CabSBookingSchema({
      from:body.form,
      to:body.to,
      date: body.date,
      carType:body.carType,
      phone:user.phone
    })
   const result = await book.save();

   return res.status(200).json({status: true, result, message:"Cab register Sucessfully"})
      
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
  bookAirCraft: async (req, res) => {
    try {
    const body = {
      from:req.body.form,
      to:req.body.to,
      date: req.body.date,
      airType:req.body.airType,
      phone:req.body.phone,
      airId:req.body.airId,
    };
    const userId = req.userId;
    const user = await Users.findById({_id:userId},{phone:1});

    const book = new ApiBookingSchema({
      from:body.form,
      to:body.to,
      date: body.date,
      airType:body.airType,
      phone:user.phone,
      userId:userId,
      airId:body.airId,
    });
   const result = await book.save();

   return res.status(200).json({status: true, result, message:"Aircraft register Sucessfully"})
      
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
  AirCraftBookingHistory: async (req, res) => {
    try {

      const body = {
        userId: req.userId,
        startDate:req.body.startDate,
        endDate:req.body.endDate,}
        const condition = {};
        if(body.startDate && !body.endDate){ return "please enter end date as well"}
        if(body.startDate){
          const edate = new Date(body.endDate.split("/").reverse().join("/"));
          const sdate = new Date(body.startDate.split("/").reverse().join("/"));
          condition.createdAt = {$gte: sdate,$lte: edate}; //I'll fix it soon
        }

        const passbook = await ApiBookingSchema.aggregate([
          {$match:condition},
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              result: { $push: "$$ROOT" },
          }
          },
          {
              $sort: { _id: -1 }
          }
      ])
      return res.status(200).json({status:true,passbook,message:"listing successflly..."});
      
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },





  createAirCraft: async (req, res) => {
    try {
    const body = req.body;
    const create = new airTrafic({
        typeAir: body.typeAir,   
        modelNo: body.modelNo,
        manufacturer: body.manufacturer,
        capacity: body.capacity,
        speed: body.speed,
        range: body.range,
        additionalDetails: body.additionalDetails,
    });
   const result = await create.save();
   return res.status(201).json({status: true, result, message:"AirCraft created Sucessfully"})
      
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
  listingAirCraft: async (req, res) => {
    try {
    const body = req.body;
    const condition = {};
    // condition.status = true;
    if(body.pickUpLocation){
      condition.availablePreference = body.pickUpLocation;
    }
    if(body.typeAir){
      condition.typeAir = body.typeAir;
    }
    const result = await airTrafic.find(condition);
   return res.status(200).json({status: true, result, message:"AirCraft Listing Sucessfully"})
      
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
  deleteAirCraft: async (req, res) => {
    try {
      if(req.role != "ADMIN"){
        return res.status(200).json({status:false, message:"Login as Admin"})
      };
    const body = req.body;
    const data = await airTrafic.findById({_id:body.airId});
    if(!data){
      return res.status(200).json({status:false, message:"no aircraft found"});
    }

    const result = await airTrafic.findByIdAndUpdate({_id:id},{$set:{status:false}},{new:true});
   return res.status(200).json({status: true, result, message:"AirCraft deleted Sucessfully"})
      
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },

};
