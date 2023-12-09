const axios = require('axios');

const phonePePayment = async(req,res)=>{
try {
  const {name,number,amount}={name:"farhan",number:"8130289007",amount:"100"};
  console.log(name,"this si sdlfj lskdfj");
  const data = {
    "merchantId": "PGTESTPAYUAT",
    "merchantTransactionId": "MT7850590068188104",
    "merchantUserId": "MUID123",
    "name":name,
    "amount": amount*100,
    "redirectUrl": "http://localhost:3001/payment/status",
    "redirectMode": "POST",
    "mobileNumber": number,
    "paymentInstrument": {
      "type": "PAY_PAGE"
    }
  }
  // const data = {
  //   "merchantId": "PGTESTPAYUAT",
  //   "merchantTransactionId": "MT7850590068188104",
  //   "merchantUserId": "MUID123",
  //   "amount": 10000,
  //   "redirectUrl": "https://webhook.site/redirect-url",
  //   "redirectMode": "REDIRECT",
  //   "callbackUrl": "https://webhook.site/callback-url",
  //   "mobileNumber": "9999999999",
  //   "paymentInstrument": {
  //     "type": "PAY_PAGE"
  //   }
  // }
  const options = {
    method: 'POST',
    url: 'https://apps-uat.phonepe.com/v3/transaction/sdk-less/initiate',
    headers: {"Content-Type": 'application/json',
    data:data}
  };

  //The Option is incorrect just make it and run

 const result = await axios(options);
 return result
} catch (khatra) {
  console.log(khatra)
  // return res.status(403).json({"khatra":khatra})
}
}
module.exports={phonePePayment}