const axios = require("axios");
const dns = require("dns");
const os = require("os");
const NodeCache = require('node-cache');
const getHotelResultsCache = new NodeCache({ stdTTL: 900 });
const assert = require('assert');
const xml2js = require('xml2js');

module.exports = {
  getHotelStaticData: async(req, res)=>{
    try {
      
       const TokenId= req.body.TokenId;
       const ClientId= process.env.CLIENT_ID_FOR_HOTEL_AUTH;
       const  EndUserIp= req.body.EndUserIp;
       const  CityId=req.body.CityId;

       const dataa = {
        TokenId:TokenId,
        ClientId:ClientId,
        EndUserIp:EndUserIp,
        CityId:CityId,
       }
      
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetHotelStaticData",
        headers: {
          "content-type": "application/JSON",
        },
        data: dataa,
      };
      const result = await axios(options);

      // console.log(result.data,"resultvresultresultresultresultresultresultresult");
      const parsedResponse = await xml2js.parseStringPromise(result.data.HotelData);
      console.log(parsedResponse,"dddddddddddddddddddddddddddss")
      return res.status(200).json(parsedResponse);

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  authenticate: async (req, res) => {
    try {

      const EndUserIp = req.body.EndUserIp

      const body = {
        ClientId: process.env.CLIENT_ID_FOR_HOTEL_AUTH,
        UserName: process.env.USERNAME_FOR_HOTEL_AUTH,
        Password: process.env.PASSWORD_FOR_HOTEL_AUTH,
        EndUserIp: req.body.EndUserIp,
      };
      if(!body.EndUserIp){
         const abc = await getIP()
         body.EndUserIp = abc;
      }
      const options = {
        method: "POST",
        url: "https://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };

      const result = await axios(options);

      console.log(result.data.Error.ErrorMessage,"asdasd");
      assert(result?.data?.Error?.ErrorCode === 0, new Error(result.data.Error.ErrorMessage));
      return res.status(200).json({ result: result.data });
    } catch (error) {
      console.log(error,"error=========<")
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getAgencyBalance:async(req,res)=>{
    try {
      const ClientId = process.env.CLIENT_ID_FOR_HOTEL_AUTH;
      const TokenAgencyId = process.env.AgencyId;
      const TokenMemberId = process.env.MemberId;
      const EndUserIp = req.body.EndUserIp;
      const TokenId = req.body.TokenId;

      const data = {
        ClientId:ClientId,
        TokenAgencyId:TokenAgencyId,
        TokenMemberId:TokenMemberId,
        EndUserIp:EndUserIp,
        TokenId:TokenId,
      }

      const options = {
        method: "POST",
        url: "http://api.tektravels.com/SharedServices/SharedData.svc/rest/GetAgencyBalance",
        headers: {
          "content-type": "application/JSON",
        },
        data: data,
      };

      const result = await axios(options);
      console.log(result,"sddddddddddd");
      assert(result?.data?.Error?.ErrorCode === 0, new Error(result.data.Error.ErrorMessage));
      return res.status(200).json({status:true, data:result.data});
      

    }catch(fur){
      return res.status(400).json({ status: false, message: fur.message });
    }
  },
  countryList: async (req, res) => {
    try {

      const TokenId = req.body.TokenId;
      const EndUserIp = req.body.EndUserIp;

      const body = {
        TokenId: TokenId,
        ClientId: process.env.CLIENT_ID_FOR_HOTEL_AUTH,
        EndUserIp:EndUserIp,
      };
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      assert(result?.data?.Error?.ErrorCode === 0, new Error(result.data.Error.ErrorMessage));
      return res.status(200).json({ result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getDestinationSearch: async (req, res) => {
    try {
      const TokenId = req.body.TokenId;
      const EndUserIp = req.body.EndUserIp;
      const body = {
        TokenId: TokenId,
        EndUserIp: EndUserIp,
        CountryCode: "IN",
        SearchType: "1",
      };
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      assert(result?.data?.Error?.ErrorCode === 0, new Error(result.data.Error.ErrorMessage));
      return res.status(200).json({ result: result.data.Destinations });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  TopDestinationList: async (req, res) => {
    try {
      const TokenId = req.body.TokenId;
      const EndUserIp = req.body.EndUserIp;
      const body = {
        TokenId: TokenId,
        ClientId: process.env.CLIENT_ID_FOR_HOTEL_AUTH,
        EndUserIp: EndUserIp,
      };
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/SharedServices/SharedData.svc/rest/TopDestinationList",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      return res.status(200).json({ result: result.data.TopDestination });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getHotelResults: async (req, res) => {
    try {
      const CheckInDate = req.body.CheckInDate;
      const NoOfNights = req.body.NoOfNights;
      const CountryCode = req.body.CountryCode;
      const CityId = req.body.CityId;
      const IsTBOMapped = process.env.IsTBOMapped;
      const ResultCount = req.body.ResultCount;
      const PreferredCurrency = req.body.PreferredCurrency;
      const GuestNationality = req.body.GuestNationality;
      const NoOfRooms = req.body.NoOfRooms;
      const MaxRating = req.body.MaxRating;
      const MinRating = req.body.MinRating;
      const ReviewScore = req.body.ReviewScore;
      const IsNearBySearchAllowed = req.body.IsNearBySearchAllowed;
      const EndUserIp = req.body.EndUserIp;
      const TokenId = req.body.TokenId;
      const RoomGuests = req.body.RoomGuests;
      const page = req.body.Page || 1;
      const limit = req.body.Limit || 8;
      const minAmount = req.body.minAmount||0;
      const maxAmount = req.body.maxAmount||9999999;
      const price = req.body.price || "MINTOMAX"; //"MINTOMAX" AND "MAXTOMIN"

      const bodi ={
        CheckInDate: CheckInDate,
        NoOfNights:NoOfNights,
        CountryCode: CountryCode,
        CityId: CityId,
        IsTBOMapped: IsTBOMapped,
        ResultCount: ResultCount,
        PreferredCurrency: PreferredCurrency,
        GuestNationality: GuestNationality,
        NoOfRooms: NoOfRooms,
        MaxRating: MaxRating,
        MinRating: MinRating,
        ReviewScore: ReviewScore,
        IsNearBySearchAllowed: IsNearBySearchAllowed,
        EndUserIp: EndUserIp,
        TokenId: TokenId,
        RoomGuests: RoomGuests,
        limit:limit,
        page:page,
        minAmount:minAmount,
        maxAmount:maxAmount,
        price:price,
      }
      // const bodi = req.bodi;
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelResult",
        headers: {
          "content-type": "application/JSON",
        },
        data: bodi,
      };
      const cacheKey = JSON.stringify(bodi);
      const cachedResult = getHotelResultsCache.get(cacheKey);
      if (cachedResult) {
        return res.send(cachedResult);
      } else {
      console.time("a");
      const result = await axios(options); //10s
      console.timeEnd("a");
      assert(result?.data?.HotelSearchResult?.Error?.ErrorCode === 0, new Error(result.data.HotelSearchResult.Error.ErrorMessage));
      const skip = bodi.limit * (bodi.page - 1);
      const data = bodi.limit * bodi.page;
      const min = bodi.minAmount;
      const max = bodi.maxAmount;
      const compare = bodi.price;

      if(result?.data?.HotelSearchResult?.HotelResults){
      var aaa = result?.data?.HotelSearchResult?.HotelResults?.map((x)=>{
        if(x.Price.OfferedPriceRoundedOff>=min && x.Price.OfferedPriceRoundedOff<=max){
          return x;
        }
      })
      if(compare== "MINTOMAX"){
        var abc =  aaa.sort((x,y)=>{
          return x.Price.OfferedPriceRoundedOff+y.Price.OfferedPriceRoundedOff
            
        });
    }
      if(compare == "MAXTOMIN"){
        var abc = aaa.sort((x,y)=>{
          return x.Price.OfferedPriceRoundedOff-y.Price.OfferedPriceRoundedOff
            
        });
      }
      
      
      
      const traceId = result.data.HotelSearchResult.TraceId;
      const restData={
        CityId: result.data.HotelSearchResult.CityId,
        Remarks:result.data.HotelSearchResult.Remarks,
        CheckInDate:result.data.HotelSearchResult.CheckInDate,
        CheckOutDate:result.data.HotelSearchResult.CheckOutDate,
        PreferredCurrency:result.data.HotelSearchResult.PreferredCurrency,
        NoOfRooms:result.data.HotelSearchResult.NoOfRooms,
        RoomGuests:result.data.HotelSearchResult.RoomGuests,
      }
      console.log(traceId, "<======traceId");
      const xyz = [];
      console.time("b");
      const far = abc.slice(skip,data);
      if (far) {
      
        for await (let s of far) {
          const newBodi = {
            TraceId: traceId,
            HotelCode: s.HotelCode,
            EndUserIp: bodi.EndUserIp,
            TokenId: bodi.TokenId,
            ResultIndex: s.ResultIndex,
          };
          if(s.SupplierHotelCodes){
            newBodi.ResultIndex = s.SupplierHotelCodes[0].ResultIndex;
            newBodi.CategoryId = s.SupplierHotelCodes[0].CategoryId;
          }
          const options = {
            method: "POST",
            url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo",
            headers: {
              "content-type": "application/JSON",
            },
            data: newBodi,
          };
          const result = await axios(options);
          s.HotelDetails =
            result?.data?.HotelInfoResult?.HotelDetails ?? null;
          xyz.push(s);
        }
      }
      console.timeEnd("b");
      getHotelResultsCache.set(cacheKey, {status:true, result: xyz, traceId , "OtherData":restData});
      return res.status(200).json({status:true, result: xyz, traceId , "OtherData":restData});
    }else{
      return res.status(404).json({status:false,message:result?.data?.HotelSearchResult?.Error ,result: [], traceId:null , "OtherData":[]});
    }
  }
    } catch (error) {
      console.log(error.message, "=========================", error);
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getHotelInfo: async (req, res) => {
    try {
      const EndUserIp = req.body.EndUserIp;
      const TokenId = req.body.TokenId;
      const TraceId = req.body.TraceId;
      const ResultIndex = req.body.ResultIndex;
      const HotelCode = req.body.HotelCode;
      const CategoryId = req.body.CategoryId;

    const body =   {
        EndUserIp: EndUserIp,
        TokenId: TokenId,
        TraceId: TraceId,
        ResultIndex: ResultIndex,
        HotelCode: HotelCode,
        CategoryId: CategoryId
      }

      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      assert(result.data.HotelInfoResult.Error.ErrorCode ===0,new Error(result.data.HotelInfoResult.Error.ErrorMessage))
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getHotelRoom: async (req, res) => {
    try {

      const AgencyId = process.env.AgencyId;
      const EndUserIp = req.body.EndUserIp;
      const TokenId = req.body.TokenId;
      const TraceId = req.body.TraceId;
      const ResultIndex = req.body.ResultIndex;
      const HotelCode = req.body.HotelCode;
      const CategoryId = req.body.CategoryId;
      const CategoryIndexes = req.body.CategoryIndexes;

      const body =  {
        AgencyId: AgencyId,
        EndUserIp:EndUserIp,
        TokenId: TokenId,
        TraceId: TraceId,
        ResultIndex: ResultIndex,
        HotelCode: HotelCode,
        CategoryIndexes: CategoryIndexes,
        CategoryId: CategoryId
      }

      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelRoom",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      assert(result.data.GetHotelRoomResult.Error.ErrorCode===0,new Error(result.data.GetHotelRoomResult.Error.ErrorMessage));
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getBlockRoom: async (req, res) => {
    try {

    //   [
    //     {
    //      "RoomIndex": "1",
    //      "RoomTypeCode": "322037529|390188504$37336^^1^^322037529|390188504|37336|127~!:~1",
    //      "RoomTypeName": "Economy Room, 1 Twin Bed",
    //      "RatePlanCode": "322037529|390188504|37336|127",
    //      "BedTypeCode": null,
    //      "SmokingPreference": 0,
    //      "Supplements": null,
    //      "Price": {
    //                        "CurrencyCode": "INR",
    //                        "RoomPrice": 389.13,
    //                        "Tax": 62.74,
    //                        "ExtraGuestCharge": 0,
    //                        "ChildCharge": 0,
    //                        "OtherCharges": 87.36,
    //                        "Discount": 0,
    //                        "PublishedPrice": 668.67,
    //                        "PublishedPriceRoundedOff": 669,
    //                        "OfferedPrice": 539.23,
    //                        "OfferedPriceRoundedOff": 539,
    //                        "AgentCommission": 129.45,
    //                        "AgentMarkUp": 0,
    //                        "ServiceTax": 15.69,
    //                        "TCS": 0,
    //                        "TDS": 51.62,
    //                        "ServiceCharge": 0,
    //                        "TotalGSTAmount": 15.6923,
    //                        "GST": {
    //                            "CGSTAmount": 0,
    //                            "CGSTRate": 0,
    //                            "CessAmount": 0,
    //                            "CessRate": 0,
    //                            "IGSTAmount": 15.6923,
    //                            "IGSTRate": 18,
    //                            "SGSTAmount": 0,
    //                            "SGSTRate": 0,
    //                            "TaxableAmount": 87.2
    //                        }
    //                    }
    //    }
    //  ]
      const ResultIndex = req.body.ResultIndex;
      const HotelCode = req.body.HotelCode;
      const HotelName = req.body.HotelName;
      const GuestNationality = req.body.GuestNationality;
      const NoOfRooms = req.body.NoOfRooms;
      const ClientReferenceNo = req.body.ClientReferenceNo;
      const IsVoucherBooking = req.body.IsVoucherBooking;
      const HotelRoomsDetails = req.body.HotelRoomsDetails;
      const EndUserIp = req.body.EndUserIp;
      const TokenId = req.body.TokenId;
      const TraceId = req.body.TraceId;
      const CategoryId = req.body.CategoryId; 

      const body = {
        ResultIndex: ResultIndex,
        HotelCode: HotelCode,
        HotelName: HotelName,
        GuestNationality: GuestNationality??"IN",
        NoOfRooms: NoOfRooms,
        ClientReferenceNo: ClientReferenceNo??"0",
        IsVoucherBooking: IsVoucherBooking??"false",
        HotelRoomsDetails: HotelRoomsDetails,
        EndUserIp: EndUserIp,
        TokenId: TokenId,
        TraceId: TraceId,
        CategoryId: CategoryId
      }

      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/BlockRoom",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      assert(result.data.BlockRoomResult.Error.ErrorCode===0,new Error(result.data.BlockRoomResult.Error.ErrorMessage))
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  bookHotels: async (req, res) => {
    try {


      // [
      //   {
      //     "RoomIndex": "1",
      //     "RoomTypeCode": "322037529|390188504$37336^^1^^322037529|390188504|37336|127~!:~1",
      //     "RoomTypeName": "Economy Room, 1 Twin Bed",
      //     "RatePlanCode": "322037529|390188504|37336|127",
      //     "BedTypeCode": null,
      //     "SmokingPreference": 0,
      //     "Supplements": null,
      //     "Price": {
      //                       "CurrencyCode": "INR",
      //                       "RoomPrice": 389.13,
      //                       "Tax": 62.74,
      //                       "ExtraGuestCharge": 0,
      //                       "ChildCharge": 0,
      //                       "OtherCharges": 87.36,
      //                       "Discount": 0,
      //                       "PublishedPrice": 668.67,
      //                       "PublishedPriceRoundedOff": 669,
      //                       "OfferedPrice": 539.23,
      //                       "OfferedPriceRoundedOff": 539,
      //                       "AgentCommission": 129.45,
      //                       "AgentMarkUp": 0,
      //                       "ServiceTax": 15.69,
      //                       "TCS": 0,
      //                       "TDS": 51.62,
      //                       "ServiceCharge": 0,
      //                       "TotalGSTAmount": 15.6923,
      //                       "GST": {
      //                           "CGSTAmount": 0,
      //                           "CGSTRate": 0,
      //                           "CessAmount": 0,
      //                           "CessRate": 0,
      //                           "IGSTAmount": 15.6923,
      //                           "IGSTRate": 18,
      //                           "SGSTAmount": 0,
      //                           "SGSTRate": 0,
      //                           "TaxableAmount": 87.2
      //                       }
      //                   },
      //     "HotelPassenger": [
      //       {
      //         "Title": "mr",
      //         "FirstName": "Rohit",
      //         "MiddleName": null,
      //         "LastName": "Bisariya",
      //         "Phoneno": null,
      //         "Email": null,
      //         "PaxType": 1,
      //         "LeadPassenger": true,
      //         "Age": 20,
      //         "PassportNo": null,
      //         "PassportIssueDate": null,
      //         "PassportExpDate": null
      //       }
      //     ]
      //   }
      // ]

      
      const EndUserIp = req.body.EndUserIp;
      const TokenId = req.body.TokenId;
      const TraceId = req.body.TraceId;
      const CategoryId = req.body.CategoryId; 
      const ResultIndex = req.body.ResultIndex; 
      const HotelCode = req.body.HotelCode; 
      const HotelName = req.body.HotelName; 
      const GuestNationality = req.body.GuestNationality; 
      const NoOfRooms = req.body.NoOfRooms; 
      const IsVoucherBooking = req.body.IsVoucherBooking; 
      const HotelRoomsDetails = req.body.HotelRoomsDetails; 
      const AgencyId = process.env.AgencyId; 
      const body = {
        EndUserIp: EndUserIp,
        TokenId: TokenId,
        TraceId: TraceId,
        CategoryId: CategoryId,
        AgencyId: AgencyId,
        ResultIndex: ResultIndex,
        HotelCode: HotelCode,
        HotelName: HotelName,
        GuestNationality: GuestNationality?? "IN",
        NoOfRooms: NoOfRooms,
        IsVoucherBooking: IsVoucherBooking??true,
        HotelRoomsDetails: HotelRoomsDetails 
      }
      
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Book",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      console.log(result.data,"sssssssssssssssssssssssssssssssssssssssssssssss")
      assert(result.data.BookResult.Error.ErrorCode === 0,new Error(result.data.BookResult.Error.ErrorMessage));
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  genrateVouters: async (req, res)=> {
    try {
      const EndUserIp = req.body.EndUserIp; 
      const BookingId = req.body.BookingId; 
      const TokenId = req.body.TokenId; 
      const body = {
        BookingId : BookingId,
        EndUserIp : EndUserIp,
        TokenId: TokenId
      };
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      assert(result.data.GenerateVoucherResult.Error.ErrorCode===0,new Error(result.data.GenerateVoucherResult.Error.ErrorMessage));
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  getBookingDetails: async(req, res)=>{
    try {
      const EndUserIp = req.body.EndUserIp; 
      const BookingId = req.body.BookingId; 
      const TokenId = req.body.TokenId; 
      const TraceId = req.body.TraceId; 
      const body = {
        EndUserIp : EndUserIp,
        TokenId: TokenId
      };
      if(BookingId){
        body.BookingId = BookingId;
      }
      if(TraceId){
        body.TraceId = TraceId;
      }
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/HotelService.svc/rest/GetBookingDetail",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
    assert(result.data.GetBookingDetailResult.Error.ErrorCode===0,new Error(result.data.GetBookingDetailResult.Error.ErrorMessage));
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  },
  sendChangeRequest: async(req, res)=> {
    try {

        const BookingMode = req.body.BookingMode;
        const RequestType = req.body.RequestType;
        const Remarks = req.body.Remarks;
        const BookingId = req.body.BookingId;
        const EndUserIp = req.body.EndUserIp;
        const TokenId = req.body.TokenId;


      const body = {
        BookingMode: BookingMode,
        RequestType: RequestType,
        Remarks: Remarks,
        BookingId: BookingId,
        EndUserIp: EndUserIp,
        TokenId: TokenId
      };
      const options = {
        method: "POST",
        url: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest",
        headers: {
          "content-type": "application/JSON",
        },
        data: body,
      };
      const result = await axios(options);
      console.log(result.data);
      return res.status(200).json({status:true, result: result.data });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }
};

const getIP = async () => {
  try {
    const address = await new Promise((resolve, reject) => {
      dns.lookup(os.hostname(), (err, address, family) => {
        if (err) {
          reject(err);
        } else {
          resolve(address);
        }
      });
    });

    return address;
  } catch (error) {
    return error.message;
  }
};
