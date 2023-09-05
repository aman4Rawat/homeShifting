
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

    suggestionPlaneAdd: async (req, res) => {
      try {

        const body = {
          amount: req.body.amount,
          }

          const result = await paymentModel.addSuggestionPayment(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(201).send(utils.response(result));
          }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    suggestionPlaneList: async (req, res) => {
      try {
          
          const result = await paymentModel.getSuggestionPayment();
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },





    invoice: async (req, res) => {
      try {

        const body = {
          userId: req.userId,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          }

          const result = await paymentModel.getInvoice(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    }
  };
} catch (err) {
  console.log(err);
}
