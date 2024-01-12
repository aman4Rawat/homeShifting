// const axios = require("axios");
// const crypto = require("crypto");
// const Buffer = require("buffer").Buffer;
// const fs = require("fs/promises");
// const os = require("os");

// function generateTransactionId() {
//   const timestamp = Date.now();
//   const randomNum = Math.floor(Math.random() * 1000000);
//   return `HS-${timestamp}${randomNum}`;
// }

// function objectId() {
//   const secondInHex = Math.floor(new Date() / 1000).toString(16);
//   const machineId = crypto
//     .createHash("md5")
//     .update(os.hostname())
//     .digest("hex")
//     .slice(0, 6);
//   const processId = process.pid.toString(16).slice(0, 4).padStart(4, "0");
//   const counter = process.hrtime()[1].toString(16).slice(0, 6).padStart(6, "0");

//   return secondInHex + machineId + processId + counter;
// }

// const createPayment = async function (req, res) {
//   try {
//     const data = {
//       merchantId: "PGTESTPAYUAT",
//       merchantTransactionId: generateTransactionId(),
//       merchantUserId: objectId(), //changes
//       amount: 1000,
//       callbackUrl: "localhost:80/status",
//       redirectUrl: "localhost:80/status",
//       redirectMode: "POST",
//       mobileNumber: "9999999999", // user phone no
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };
//     const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"; //"4fd7bf65-f7bb-4158-8b1a-e76b7569fa46";
//     const payload = JSON.stringify(data);
//     console.log(data, payload);
//     const payloadMain = Buffer.from(payload, "utf-8").toString("base64");
//     console.log("payload", payloadMain);

//     let keyIndex = 1;
//     // sha256(base64Body + apiEndPoint + saltKey) + ### + saltKeyIndex;
//     const string = payloadMain + "/pg/v1/pay" + key;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = sha256 + "###" + keyIndex; // changes

//     console.log("checksum", checksum);
//     console.log("payloadMain", payloadMain);

//     // await axios.post(
//     //   "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//     //   { request: payloadMain },
//     //   {
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       "X-VERIFY": checksum,
//     //       accept: "application/json",
//     //     },
//     //   }
//     // );
//     // const options = {
//     //   method: "POST",
//     //   url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     "X-VERIFY": checksum,
//     //   },
//     //   data: { request: payloadMain },
//     // };
//    await axios
//       .post(
//         "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//         { request: payloadMain },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "X-VERIFY": checksum,
//             accept: "application/json",
//           },
//         }
//       )
//       .then(function (response) {
//         console.log("transaction completed!", response.data);
//         //res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
//       })
//       .catch(function (error) {
//         console.log("=======>" + error.message);
//       });
//     // request(options);
//     // res.end(response);
//   } catch (error) {
//     console.log(error);
//     const file = await fs.writeFile("test.txt", `${error}`);
//     console.log("file .............", file);
//   }
//   // console.log(response.data.data.instrumentResponse);
// };

// module.exports.checkStatus = async function (req, res) {};

// module.exports.merchantDetails = async function (req, res) {
//   try {
//     const key = "4fd7bf65-f7bb-4158-8b1a-e76b7569fa46";
//     const string = "/pg/v1/options/HOMESHIFTONLINE" + key;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const xVerifyKey = sha256 + "###1";

//     // const options = {
//     //     method: 'GET',
//     //     url: 'https://api-preprod.phonepe.com/apis/hermes/pg/v1/options/merchantId?includeNetBankingBanksList=true',
//     //     headers: { accept: 'application/json', 'Content-Type': 'application/json' }
//     // };

//     // axios
//     //   .request(options)
//     //   .then(function (response) {
//     //     console.log(response.data);
//     //   })
//     //   .catch(function (error) {
//     //     console.error(error);
//     //   });

//     // console.log('xVerifyKey', xVerifyKey)

//     // const options = {
//     //   method: "GET",
//     //   url: "https://api-preprod.phonepe.com/apis/hermes/pg/v1/options/HOMESHIFTONLINE?includeNetBankingBanksList=true",
//     //   headers: {
//     //     accept: "application/json",
//     //     "Content-Type": "application/json",
//     //     "X-VERIFY": xVerifyKey,
//     //     "X-MERCHANT-ID": "HOMESHIFTONLINE",
//     //   },
//     // };
//     // const response = await axios.request(options);
//     res.end(response);
//   } catch (error) {
//     console.log(error);
//     const file = await fs.writeFile("test.txt", `${error}`);
//     console.log("file .............", file);
//   }
//   // console.log(response.data.data.instrumentResponse);
// };

// // const text =
// //   "eyJtZXJjaGFudElkIjoiUEdURVNUUEFZVUFUIiwibWVyY2hhbnRUcmFuc2FjdGlvbklkIjoiSFMtMTcwMjAxNzgxMDg1MDM4NjAyIiwibWVyY2hhbnRVc2VySWQiOiI2NTcyYmIxMjk4Y2E5NzI3MjQ4YWNkOTEiLCJhbW91bnQiOjEwMDAsImNhbGxiYWNrVXJsIjoibG9jYWxob3N0OjgwL3N0YXR1cyIsInJlZGlyZWN0VXJsIjoibG9jYWxob3N0OjgwL3N0YXR1cyIsInJlZGlyZWN0TW9kZSI6IlJFRElSRUNUIiwibW9iaWxlTnVtYmVyIjoiOTg1NDc4MTI1OSIsInBheW1lbnRJbnN0cnVtZW50Ijp7InR5cGUiOiJQQVlfUEFHRSJ9fQ==";

// // const sdk = require('api')('@phonepe-docs/v1#3dxznuf1gljiezluv');

// // sdk.payApi()
// //   .then(({ data }) => console.log(data))
// //   .catch(err => console.error(err));

// // const axios = require("axios");

// // const options = {
// //   method: "POST",
// //   url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
// //   headers: { accept: "application/json", "Content-Type": "application/json" },
// // };

// // axios
// //   .request(options)
// //   .then(function (response) {
// //     console.log(response.data);
// //   })
// //   .catch(function (error) {
// //     console.error(error);
// //   });
// // createPayment("","")