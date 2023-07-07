const Razorpay = require("razorpay");
const crypto = require("crypto");

const { RAZORPAYKEYID, RAZORPAYKEYSECRET } = require("../config");

let instance = new Razorpay({
  key_id: "rzp_test_ax5R0HtxrLmVyD",
  key_secret: "GtWiRjjdH8bWjGuIdgXeiewm",
});

module.exports = {
  createOrder: async (amount, currency, receipt) => {
    try {
      var options = {
        amount: amount, // amount in the smallest currency unit
        currency: currency,
      };
      const order = await instance.orders.create(options);
      return order;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  verifyOrder: async (paymentId, paymentSignature, paymentOrderId) => {
    try {
      let body = paymentOrderId + "|" + paymentId;
      let expectedSignature = crypto
        .createHmac("sha256", "GtWiRjjdH8bWjGuIdgXeiewm")
        .update(body.toString())
        .digest("hex");
      var response = { signatureIsValid: "false" };
      if (expectedSignature === paymentSignature)
        response = { signatureIsValid: "true" };
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
