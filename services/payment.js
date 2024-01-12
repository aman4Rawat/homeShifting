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
  console.log("data", data);
  let sample_salt_key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const payload = JSON.stringify(data);
  const payloadMain = Buffer.from(payload);
  let base64String = payloadMain.toString("base64");
  let keyIndex = 1;
  const string = base64String + "/pg/v1/pay" + sample_salt_key;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;
  console.log(checksum);
  axios
    .post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      {
        request: base64String,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      console.log("transaction completed!");
      //res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
      console.log("=======>" + error.message);
    });
} catch (khatra) {
  console.log(khatra)
  // return res.status(403).json({"khatra":khatra})
}
}
module.exports={phonePePayment}