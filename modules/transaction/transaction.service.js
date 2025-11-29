const axios = require("axios");
const Transaction = require("../../models/Transaction");
const throwError = require("../../middlewares/throw-error");

const isSandbox = process.env.ZARINPAL_SANDBOX === "true";
const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const REQUEST_URL = isSandbox
  ? process.env.ZARINPAL_REQUEST_URL_SANDBOX
  : process.env.ZARINPAL_REQUEST_URL;
const VERIFY_URL = isSandbox
  ? process.env.ZARINPAL_VERIFY_URL_SANDBOX
  : process.env.ZARINPAL_VERIFY_URL;
const STARTPAY = isSandbox
  ? process.env.ZARINPAL_STARTPAY_URL_SANDBOX
  : process.env.ZARINPAL_STARTPAY_URL;

const transactionService = {
  async create(data) {
    const transaction = new Transaction(data);

    return await transaction.save();
  },

  async getDetails(_id) {
    const transaction = await Transaction.findById(_id).populate("orderId");

    if (!transaction) {
      throwError("Transaction not found.", 404);
    }

    return transaction;
  },

  async update(_id, data){
    const transaction = await Transaction.findByIdAndUpdate(_id, data, {new: true})

    return transaction
  },

  async requestPayment({
    amount,
    description,
    callback_url,
    metadata = {},
  }) {
    const payload = {
      merchant_id: MERCHANT_ID,
      amount: 10000,
      description,
      callback_url,
      metadata: {mobile: "09121234567", email:"test.example.com"},
    };

    const res = await axios.post(REQUEST_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  async verifyPayment({ amount, authority }) {
    const payload = {
      merchant_id: MERCHANT_ID,
      amount,
      authority,
    };
    const res = await axios.post(VERIFY_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  buildStartPayUrl(authority) {
    return `${STARTPAY}${authority}`;
  },
};

module.exports = transactionService;
