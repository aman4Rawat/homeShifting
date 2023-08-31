
const paymentModel = require("../models/payment/index.js");
const utils = require("../libs/utils");

try {
  module.exports = {
    createPayment: async (req, res) => {
      try {

        const body = {
          amount: req.body.amount,
          userId: req.userId,
          businessId: req.body.businessId,
          }

          const result = await paymentModel.addPayment(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(201).send(utils.response(result));
          }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    getPaymentStatus: async (req, res) => {
      try {

        const body = {
          orderId: req.body.orderId,
          }

          const result = await paymentModel.getPayment(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
  };
} catch (err) {
  console.log(err);
}
