const {
  CFConfig,
  CFEnvironment,
  CFPaymentGateway,
} = require("cashfree-pg-sdk-nodejs");
const {
  paymentSchema,
  suggestionPlaneSchema,
  pruchasedPackageSchema,
} = require("./paymentSchema.js");
const packageSchame = require("../admin/packageSchame.js");
const businessSchema = require("../vendor/vendorBusinessSchema.js");
const passbookSchema = require("../vendor/passbookSchema.js");
const invoiceSchema = require("./invoiceSchema.js");
const userSchema = require("../user/userSchema.js");
const { generatePDF } = require("../../middlewares/pdf.js");
const PAYMENTKEY = process.env.TESTPAYMENTKEY;
const PAYMENTSECTRET = process.env.TESTPAYMENTSECRET;

var cfConfig = new CFConfig(
  CFEnvironment.SANDBOX,
  "2022-09-01",
  PAYMENTKEY,
  PAYMENTSECTRET
);
const { CFCustomerDetails, CFOrderRequest } = require("cashfree-pg-sdk-nodejs");
const { Schema } = require("mongoose");
try {
  module.exports = {
    // addPayment: async (body) => {
    //   try {
    //     const user = await userSchema.findOne({ _id: body.userId });
    //     const paymentGateway = new PaymentGateway({
    //       env: "TEST",
    //       apiVersion: "2021-05-21",
    //       appId: PAYMENTKEY,
    //       secretKey: PAYMENTSECTRET,
    //     });

    //     const generateOrderId = () => {
    //       const timestamp = Date.now();
    //       const randomId = Math.floor(Math.random() * 1000);
    //       return `${timestamp}-${randomId}`;
    //     };
    //     const orderId = generateOrderId();
    //     const tatti = Number(body.amount);
    //     const TotalAmount = tatti * 0.18 + tatti;
    //     const result = await paymentGateway.orders.createOrders({
    //       orderId: orderId,
    //       orderAmount: TotalAmount,
    //       orderCurrency: "INR",
    //       orderNote: "Test Order",
    //       customerName: user.name,
    //       customerPhone: user.mobile_number,
    //       customerEmail: "test@email.com",
    //     });
    //     const payment = new paymentSchema({
    //       orderId: orderId,
    //       amount: body.amount,
    //       paidAmount: TotalAmount,
    //       userId: body.userId,
    //       businessId: body.businessId,
    //     });
    //     await payment.save();
    //     return { result, orderId };
    //   } catch (err) {
    //     return err;
    //   }
    // },

    orderCreate: async (body) => {
      try {
        const paidAmount =
          Number(body.amount) * process.env.GST + Number(body.amount);
        var customerDetails = new CFCustomerDetails();
        customerDetails.customerId = body.userId;
        customerDetails.customerPhone = body?.mobileNumber ?? "8130289007";
        customerDetails.customerEmail =
          body?.email ?? "developerfarhan7@gmail.com";
        var d = {};
        d["order_tag_01"] = "TESTING IT";

        var cFOrderRequest = new CFOrderRequest();
        cFOrderRequest.orderAmount = paidAmount;
        cFOrderRequest.orderCurrency = "INR";
        cFOrderRequest.customerDetails = customerDetails;
        cFOrderRequest.orderTags = d;
        try {
          var apiInstance = new CFPaymentGateway();

          var result = await apiInstance.orderCreate(cfConfig, cFOrderRequest);
          if (result?.cfOrder?.orderId) {
            const payment = new paymentSchema({
              orderId: result?.cfOrder?.orderId,
              amount: body.amount,
              paidAmount: paidAmount,
              userId: body.userId,
              businessId: body.businessId,
            });
            await payment.save();
          }
          return result;
        } catch (e) {
          console.log(e);
        }
      } catch (err) {
        return err;
      }
    },

    getPayment: async (body) => {
      try {
        var apiInstance = new CFPaymentGateway();
        var orderId = body.orderId;
        var result = await apiInstance.getOrder(cfConfig, orderId);
        if (result?.cfOrder?.orderStatus === "PAID") {
          const payment = await paymentSchema.findOneAndUpdate(
            { orderId: body.orderId },
            {
              paymentStatus: result?.cfOrder?.orderStatus,
              referenceId: result?.cfOrder?.cfOrderId,
              paymentMode: result?.cfOrder?.paymentMode,
              productName: "Package Purchase",
            },
            { new: true }
          );
          const business = await businessSchema.findOneAndUpdate(
            { _id: payment.businessId },
            { $inc: { wallet: payment.amount } },
            { new: true }
          );

          const passbook = new passbookSchema({
            businessId: payment.businessId,
            userId: body?.userId,
            title: "Payment Received",
            amount: payment.amount,
            transactionType: "CREDIT",
            availableBalance: business?.wallet,
          });
          await passbook.save();

          await invoiceSchema.create({
            businessId: payment.businessId,
            payment: payment._id,
          });

          return {
            status: "PAID",
            payment: payment,
            business: business?.wallet,
          };
        }
        if (result?.cfOrder?.orderStatus !== "PAID") {
          const payment = await paymentSchema.findOneAndUpdate(
            { orderId: body.orderId },
            {
              paymentStatus: "FAILED",
              referenceId: result?.cfOrder?.referenceId,
              paymentMode: result?.cfOrder?.paymentMode,
            },
            { new: true }
          );
          return { status: "FAILED", payment: payment };
        }
      } catch (err) {
        return err;
      }
    },

    // getPayment: async (body) => {
    //   try {
    //     const paymentGateway = new PaymentGateway({
    //       env: "TEST",
    //       apiVersion: "2021-05-21",
    //       appId: PAYMENTKEY,
    //       secretKey: PAYMENTSECTRET,
    //     });
    //     const a = await paymentGateway.orders.getStatus({
    //       orderId: body.orderId,
    //     });
    //     const payment = await paymentSchema.findOneAndUpdate(
    //       { orderId: body.orderId },
    //       {
    //         paymentStatus: a.txStatus,
    //         referenceId: a.referenceId,
    //         paymentMode: a.paymentMode,
    //       },
    //       { new: true }
    //     );
    //     return a;
    //   } catch (err) {
    //     return err;
    //   }
    // },

    addSuggestionPayment: async (body) => {
      try {
        const suggestionPlane = new suggestionPlaneSchema({
          amount: body.amount,
        });
        const result = await suggestionPlane.save();
        return result;
      } catch (err) {
        return err;
      }
    },

    getSuggestionPayment: async () => {
      try {
        const suggestionPlane = await suggestionPlaneSchema
          .find()
          .sort({ amount: 1 });
        return suggestionPlane;
      } catch (err) {
        return err;
      }
    },

    purchasePackage: async (body) => {
      try {
        if (!body.businessId) {
          console.log("this is if condition no businessId so it will take first businessId here")
          var business = await businessSchema
            .findOne({ userId: body.userId })
            .sort({ createdAt: 1 });
        }else{
          console.log(body.businessId, "this is else condition here is businessId already...")
          var business = await businessSchema
            .findOne({ _id: body.businessId });
        }
        const package = await packageSchame.findOne({ _id: body.packageId });
        if (!package) {
          return new Error("package not found");
        }
        const paidAmount =
          Number(body.amount) * process.env.GST + Number(body.amount);
        var customerDetails = new CFCustomerDetails();
        customerDetails.customerId = body.userId;
        customerDetails.customerPhone = business?.mobileNumber.toString() ?? "";
        customerDetails.customerEmail = business?.email ?? "";
        var d = {};
        d["order_tag_01"] = "TESTING IT";

        var cFOrderRequest = new CFOrderRequest();
        cFOrderRequest.orderAmount = paidAmount;
        cFOrderRequest.orderCurrency = "INR";
        cFOrderRequest.customerDetails = customerDetails;
        cFOrderRequest.orderTags = d;

        console.log(cFOrderRequest,"this is cFOrderRequest... fucking nigga")
        try {
          var apiInstance = new CFPaymentGateway();

          const nayaorder = await apiInstance.orderCreate(
            cfConfig,
            cFOrderRequest
          );
          if (nayaorder?.cfOrder?.orderId) {
            const payment = new paymentSchema({
              orderId: nayaorder?.cfOrder?.orderId,
              amount: body.amount,
              paidAmount: paidAmount,
              userId: body.userId,
              businessId: body.businessId?body.businessId:business._id,
              productName: "Recharge Wallet",
            });
            var abc = await payment.save();
          }
          return nayaorder;
        } catch (e) {
          console.log(e);
        }
      } catch (err) {
        return err;
      }
    },

    verifyPurchasePackage: async (body) => {
      try {
        const package = await packageSchame.findById({ _id: body.packageId });
        if (!package) {
          return new Error("package not found");
        }
        const paidAmount =
          Number(body.amount) * process.env.GST + Number(body.amount);
        var apiInstance = new CFPaymentGateway();
        var orderId = body.orderId;
        var result = await apiInstance.getOrder(cfConfig, orderId);
        if (result?.cfOrder?.orderStatus === "PAID") {
          var payment = await paymentSchema.findOneAndUpdate(
            { orderId: body.orderId },
            {
              paymentStatus: result?.cfOrder?.orderStatus,
              referenceId: result?.cfOrder?.referenceId,
              paymentMode: result?.cfOrder?.paymentMode,
            },
            { new: true }
          );
          const sexxx = new Date().getMonth() + package?.packageDuration;
          const porn = new Date().setMonth(sexxx);

          const some = new pruchasedPackageSchema({
            userId: body.userId,
            packageId: body.packageId,
            package: package,
            amount: payment.amount,
            paidAmount:
              Number(payment.amount) * process.env.GST + Number(payment.amount),
            businessId: payment.businessId,
            expireDate: new Date(porn),
            orderId: result?.cfOrder?.orderId,
          });
          const purchase = await some.save();
          const business = await businessSchema.findOneAndUpdate(
            { _id: payment.businessId },
            {
              $inc: { wallet: payment.amount },
              $set: {
                packageId: body.packageId,
                packagePurchaseId: purchase._id,
              },
            },
            { new: true }
          );
          const passbook = new passbookSchema({
            businessId: payment.businessId,
            userId: body?.userId,
            title: "Purchase Package",
            amount: payment.amount,
            transactionType: "CREDIT",
            availableBalance: business?.wallet,
          });
          await passbook.save();
          await invoiceSchema.create({
            businessId: payment.businessId,
            payment: payment._id,
          });
          return {
            status: "PAID",
            payment: payment,
            business: business?.wallet,
            purchase: purchase,
          };
        }
        if (result?.cfOrder?.orderStatus !== "PAID") {
          const payment = await paymentSchema.findOneAndUpdate(
            { orderId: body.orderId },
            {
              paymentStatus: "FAILED",
              referenceId: result?.cfOrder?.referenceId,
              paymentMode: result?.cfOrder?.paymentMode,
            },
            { new: true }
          );
          await invoiceSchema.create({
            businessId: payment.businessId,
            payment: payment._id,
          });
          return { status: "FAILED", payment: payment };
        }
      } catch (err) {
        return err;
      }
    },

    getInvoice: async (body) => {
      try {
        if (!body.businessId) {
          const business = await businessSchema
            .findOne({ userId: body.userId })
            .sort({ createdAt: 1 });
          body.businessId = business?._id ?? "64ca05ef24a527edc66a0ea1";
        }
        const condition = { businessId: body.businessId };
        if (body.startDate && body.endDate) {
          condition.createdAt = {
            $gte: new Date(body.startDate.split("/").reverse().join("/")),
            $lte: new Date(body.endDate.split("/").reverse().join("/")),
          };
        }
        const payment = await invoiceSchema
          .find(condition)
          .populate("payment")
          .sort({ createdAt: -1 });

        return payment;
        //farhan
      } catch (err) {
        return err;
      }
    },

    getInvoiceById: async (body) => {
      try {
        const data = await invoiceSchema
          .findOne({ _id: body.invoiceId })
          .populate("payment");
        if (!data) {
          return new Error("invoice not found");
        }

        const invoice = await generatePDF(data);
        return invoice;
      } catch (err) {
        return err;
      }
    },
  };
} catch (e) {
  log.error(e);
}
