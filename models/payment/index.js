const { PaymentGateway } = require("@cashfreepayments/cashfree-sdk");
const {
  CFConfig,
  CFEnvironment,
  CFPaymentGateway,
} = require("cashfree-pg-sdk-nodejs");
const { paymentSchema, suggestionPlaneSchema } = require("./paymentSchema.js");
const packageSchame = require("../admin/packageSchame.js");
const businessSchema = require("../vendor/vendorBusinessSchema.js");
const userSchema = require("../user/userSchema.js");
const PAYMENTKEY = process.env.TESTPAYMENTKEY;
const PAYMENTSECTRET = process.env.TESTPAYMENTSECRET;

var cfConfig = new CFConfig(
  CFEnvironment.SANDBOX,
  "2022-01-01",
  PAYMENTKEY,
  PAYMENTSECTRET
);
const {CFCustomerDetails , CFOrderRequest} = require("cashfree-pg-sdk-nodejs");
try {
  module.exports = {
    addPayment: async (body) => {
      try {
        const user = await userSchema.findOne({ _id: body.userId });
        const paymentGateway = new PaymentGateway({
          env: "TEST",
          apiVersion: "2021-05-21",
          appId: PAYMENTKEY,
          secretKey: PAYMENTSECTRET,
        });

        const generateOrderId = () => {
          const timestamp = Date.now();
          const randomId = Math.floor(Math.random() * 1000);
          return `${timestamp}-${randomId}`;
        };
        const orderId = generateOrderId();
        const tatti = Number(body.amount);
        const TotalAmount = tatti * 0.18 + tatti;
        const result = await paymentGateway.orders.createOrders({
          orderId: orderId,
          orderAmount: TotalAmount,
          orderCurrency: "INR",
          orderNote: "Test Order",
          customerName: user.name,
          customerPhone: user.mobile_number,
          customerEmail: "test@email.com",
        });
        const payment = new paymentSchema({
          orderId: orderId,
          amount: body.amount,
          paidAmount: TotalAmount,
          userId: body.userId,
          businessId: body.businessId,
        });
        await payment.save();
        return { result, orderId };
      } catch (err) {
        return err;
      }
    },

    orderCreate: async (body) => {
      try {

        var customerDetails = new CFCustomerDetails();
        customerDetails.customerId = body.userId;
        customerDetails.customerPhone = "8130289007";
        customerDetails.customerEmail = "farhan@cashfree.com";
        var d = {};
        d["order_tag_01"] = "TESTING IT";

        var cFOrderRequest = new CFOrderRequest();
        cFOrderRequest.orderAmount = body.amount;
        cFOrderRequest.orderCurrency = "INR";
        cFOrderRequest.customerDetails = customerDetails;
        cFOrderRequest.orderTags = d;
        try {
          var apiInstance = new CFPaymentGateway();

          var result = await apiInstance.orderCreate(cfConfig, cFOrderRequest);
          if (result != null) {
            console.log(result?.cfOrder?.paymentSessionId);
            console.log(result?.cfOrder?.orderId);
            console.log(result?.cfHeaders, "this is fucking cfHeaders");
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
        const paymentGateway = new PaymentGateway({
          env: "TEST",
          apiVersion: "2021-05-21",
          appId: PAYMENTKEY,
          secretKey: PAYMENTSECTRET,
        });
        const a = await paymentGateway.orders.getStatus({
          orderId: body.orderId,
        });
        const payment = await paymentSchema.findOneAndUpdate(
          { orderId: body.orderId },
          {
            paymentStatus: a.txStatus,
            referenceId: a.referenceId,
            paymentMode: a.paymentMode,
          },
          { new: true }
        );
        return a;
      } catch (err) {
        return err;
      }
    },

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
        const package = await packageSchame.findOne({ _id: body.packageId });
        if (!package) {
          return new Error("package not found");
        }
        //pruchasedPackageSchema have to create
        const some = new pruchasedPackageSchema({
          userId: body.userId,
          packageId: body.packageId,
          package: package,
          amount: body.amount,
        });
        const result = await some.save();
        return result;
      } catch (err) {
        return err;
      }
    },

    getInvoice: async (body) => {
      try {
        const businessId = await businessSchema
          .findOne({ userId: body.userId })
          .sort({ createdAt: 1 });

        const condition = { businessId: businessId._id };
        if (body.startDate && body.endDate) {
          condition.createdAt = {
            $gte: new Date(body.startDate.split("/").reverse().join("/")),
            $lte: new Date(
              body.endDatestart_date.split("/").reverse().join("/")
            ),
          };
        }
        const payment = await paymentSchema
          .find(condition)
          .sort({ createdAt: -1 });
        return payment;
      } catch (err) {
        return err;
      }
    },
  };
} catch (e) {
  log.error(e);
}
