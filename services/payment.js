const axios = require('axios');

const phonePePayment = async(req,res)=>{
try {
  const {name,number,amount}=req.body;
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
  
} catch (khatra) {
  return res.status(403).json("khatra")
}
}

module.exports={phonePePayment}