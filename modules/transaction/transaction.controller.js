const transactionService = require("./transaction.service");
const orderService = require("../order/order.service");

const { calculateFinalPrice } = require("../../lib/number");

const APP_BASE = process.env.APP_BASE_URL; // e.g. https://your-backend
const FRONTEND_BASE = process.env.FRONTEND_BASE_URL; // e.g. https://app.amiranwatch.com

const transactionController = {
  async initiate(req, res) {
    try {
      // 1) Validate orderId & amount on server side (never trust client)
      const { orderId } = req.body;
      const order = await orderService.getDetails(orderId);

      const amount = calculateFinalPrice(order.price);

      const txn = await transactionService.create({
        orderId: order._id,
        amount,
        description: `پرداخت برای سفارش ${order._id}`,
        metadata: {
          mobile: order.customer.phone,
          email: order.customer.email || "",
        },
        status: "PENDING",
      });

      // callback_url: include transaction id so you can find the txn on callback
      const callbackUrl = `${APP_BASE}/api/transaction/verify?tx=${txn._id}`;

      const result = await transactionService.requestPayment({
        amount,
        description: txn.description,
        callback_url: callbackUrl,
        metadata: {
          mobile: req.body.mobile || "",
          email: req.body.email || "",
        },
      });

      // Check response: result.data.code === 100 => success
      const data = result.data || {};
      if (data.code === 100 && data.authority) {
        txn.authority = data.authority;
        txn.status = "PENDING_REDIRECT";
        await txn.save();

        // add transaction ref to order
        await orderService.addTransactionToOrder(order._id, txn._id);

        const redirectUrl = transactionService.buildStartPayUrl(data.authority);
        return res.json({ redirectUrl });
      } else {
        txn.status = "FAILED";
        txn.error = {
          code: data.code || -1,
          message: data.message || "Request failed",
        };
        await txn.save();
        return res
          .status(400)
          .json({ error: data.message || "Could not create payment" });
      }
    } catch (err) {
      console.error("initiate err", err);
      return res.status(500).json({ error: "internal error" });
    }
  },

  async verify(req, res) {
    let txn; // declare txn in outer scope
    try {
      const { tx } = req.query;
      const { Authority, authority } = req.query;
      const authorityParam = Authority || authority;

      txn = await transactionService.getDetails(tx);

      const order = txn.orderId;

      // If already successful => redirect immediately
      if (txn.status === "SUCCESS") {
        return res.redirect(
          `${FRONTEND_BASE}/payment-result?order=${order.code}&result=successful`
        );
      }

      // Missing or mismatched authority
      if (!authorityParam || txn.authority !== authorityParam) {
        txn.status = "FAILED";
        txn.error = { message: "Authority mismatch" };
        await transactionService.update(txn._id, {
          status: txn.status,
          error: txn.error,
          authority: txn.authority, // only if you changed it
          refId: txn.refId, // only if you changed it
        });

        return res.redirect(
          `${FRONTEND_BASE}/payment-result?order=${order.code}&result=failed`
        );
      }

      // Verify with Zarinpal
      const verifyRes = await transactionService.verifyPayment({
        amount: 10000,
        // amount: txn.amount,
        authority: authorityParam,
      });

      const vdata = verifyRes.data || {};

      // Payment success
      if (vdata.code === 100) {
        txn.status = "SUCCESS";
        txn.refId = vdata.ref_id;
        await transactionService.update(txn._id, {
          status: txn.status,
          error: txn.error,
          authority: txn.authority, // only if you changed it
          refId: txn.refId, // only if you changed it
        });

        await orderService.update({ status: "processing" }, order._id);

        return res.redirect(
          `${FRONTEND_BASE}/payment-result?order=${order.code}&result=successful`
        );
      }

      // Payment failed
      txn.status = "FAILED";
      txn.error = { code: vdata.code, message: vdata.message };
      await transactionService.update(txn._id, {
        status: txn.status,
        error: txn.error,
        authority: txn.authority, // only if you changed it
        refId: txn.refId, // only if you changed it
      });

      return res.redirect(
        `${FRONTEND_BASE}/payment-result?order=${order.code}&result=failed`
      );
    } catch (err) {
      console.error("verify error", err);

      // safe fallback if txn is undefined
      const orderCode = txn?.orderId?.code || "unknown";
      return res.redirect(
        `${FRONTEND_BASE}/payment-result?order=${orderCode}&result=failed`
      );
    }
  },
};

module.exports = transactionController;
