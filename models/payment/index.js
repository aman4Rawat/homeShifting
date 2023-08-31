
const axios = require('axios');
const { PaymentGateway } = require('@cashfreepayments/cashfree-sdk');
const paymentSchema = require('./paymentSchema.js');
const userSchema = require('../user/userSchema.js');
const businessSchema = require('../vendor/vendorBusinessSchema.js');
const PAYMENTKEY = process.env.TESTPAYMENTKEY;
const PAYMENTSECTRET = process.env.TESTPAYMENTSECRET;
try {
  module.exports = {
    addPayment: async (body) => {
      try {
        const user = await userSchema.findOne({_id:body.userId});
        const paymentGateway = new PaymentGateway({
            env: 'TEST',
            apiVersion: '2021-05-21',
            appId: PAYMENTKEY,
            secretKey: PAYMENTSECTRET,
            });
            const generateOrderId = () => {
            const timestamp = Date.now();
            const randomId = Math.floor(Math.random() * 1000); 
            return `${timestamp}-${randomId}`;
          };
          const orderId = generateOrderId();
            const a = await paymentGateway.orders.createOrders({
                orderId: orderId,
                orderAmount: body.amount,
                orderCurrency: 'INR',
                orderNote: 'Test Order',
                customerName: user.name,
                customerPhone: user.mobile_number,
                customerEmail: 'test@email.com',
                });
              const payment = new paymentSchema({
                    orderId: orderId,
                    amount: body.amount,
                    userId: body.userId,
                    businessId: body.businessId,
                    });
                await payment.save();
                return result;
      } catch (err) {
        return err;
      }
    },
    getPayment: async (body) => {
      try {
        const paymentGateway = new PaymentGateway({
            env: 'TEST',
            apiVersion: '2021-05-21',
            appId: PAYMENTKEY,
            secretKey: PAYMENTSECTRET,
            });
            const a = await paymentGateway.orders.getStatus({
                orderId: body.orderId,
                });
            const payment = await paymentSchema.findOneAndUpdate({orderId:body.orderId},{paymentStatus:a.txStatus,referenceId:a.referenceId,paymentMode:a.paymentMode},{new:true});
                return a;
      } catch (err) {
        return err;
      }
    },
  };
} catch (e) {
  log.error(e);
}
