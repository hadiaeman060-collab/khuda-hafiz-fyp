const express = require("express");
const Booking = require("./models/Booking");

const router = express.Router();

function getSafepay() {
  const secretKey = process.env.SAFEPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SAFEPAY_SECRET_KEY is missing in your .env file");
  }

  const isLive = process.env.SAFEPAY_ENVIRONMENT === "production";
  const host = isLive
    ? (process.env.SAFEPAY_LIVE_URL || "https://api.getsafepay.com")
    : (process.env.SAFEPAY_SANDBOX_URL || "https://sandbox.api.getsafepay.com");

  const safepay = require("@sfpy/node-core")(secretKey, {
    authType: "secret",
    host: host,
  });

  return { safepay, host, isLive };
}

// POST /safepay/initiate - Start a payment for a booking
router.post("/initiate", async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "bookingId is required" });
    }

    const apiKey = process.env.SAFEPAY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "SAFEPAY_API_KEY missing in .env" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "This booking is already paid" });
    }

    const { safepay, isLive } = getSafepay();
    const environment = isLive ? "production" : "sandbox";
    const amountInPaisa = Math.round(booking.totalPrice * 100);

    console.log(`Creating Safepay tracker for booking ${bookingId}, amount: Rs ${booking.totalPrice} (${amountInPaisa} paisa)`);

    const sessionResponse = await safepay.payments.session.setup({
      merchant_api_key: apiKey,
      intent: "CYBERSOURCE",
      mode: "payment",
      currency: "PKR",
      amount: amountInPaisa,
      metadata: {
        order_id: bookingId.toString(),
      },
    });

    const trackerToken = sessionResponse?.data?.tracker?.token;
    if (!trackerToken) {
      console.error("Safepay session response:", JSON.stringify(sessionResponse));
      return res.status(500).json({ error: "Failed to create payment session" });
    }

    const authResponse = await safepay.client.passport.create();
    const authToken = authResponse?.data;

    if (!authToken) {
      console.error("Safepay auth response:", JSON.stringify(authResponse));
      return res.status(500).json({ error: "Failed to create auth token" });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

    const checkoutUrl = safepay.checkout.createCheckoutUrl({
      tracker: trackerToken,
      tbt: authToken,
      env: environment,
      source: "mobile",
      redirect_url: `${backendUrl}/safepay/result?status=success&bookingId=${bookingId}`,
      cancel_url: `${backendUrl}/safepay/result?status=cancelled&bookingId=${bookingId}`,
    });

    booking.paymentStatus = "pending";
    booking.safepayTracker = trackerToken;
    if (booking.paymentMode !== "online") {
      booking.paymentMode = "online";
    }
    await booking.save();

    return res.json({
      success: true,
      checkoutUrl: checkoutUrl,
      tracker: trackerToken,
      bookingId: booking._id,
      amount: booking.totalPrice,
    });

  } catch (err) {
    console.error("Safepay initiate error:", err?.message || err);
    return res.status(500).json({
      error: "Failed to initiate payment",
      detail: err?.message || String(err),
    });
  }
});

// POST /safepay/webhook - Safepay calls this after payment
router.post("/webhook", async (req, res) => {
  try {
    console.log("Safepay webhook received:", JSON.stringify(req.body));
    res.status(200).json({ received: true });

    const data = req.body;
    const tracker = data?.data?.tracker;
    const trackerToken = tracker?.token;
    const trackerState = tracker?.state;

    if (!trackerToken) {
      console.error("Webhook missing tracker token");
      return;
    }

    let booking = await Booking.findOne({ safepayTracker: trackerToken });
    if (!booking) {
      const orderId = tracker?.metadata?.order_id;
      if (orderId) {
        booking = await Booking.findById(orderId).catch(() => null);
      }
      if (!booking) {
        console.error("Booking not found for tracker:", trackerToken);
        return;
      }
    }

    if (trackerState === "TRACKER_ENDED") {
      booking.paymentStatus = "paid";
      booking.paidAt = new Date();
    } else if (trackerState === "TRACKER_FAILED" || trackerState === "TRACKER_CANCELLED") {
      booking.paymentStatus = "failed";
    }

    booking.safepayResponseState = trackerState;
    booking.safepayTracker = trackerToken;
    await booking.save();

    console.log(`Booking ${booking._id} payment ${trackerState === "TRACKER_ENDED" ? "SUCCESS" : "FAILED"}`);

  } catch (err) {
    console.error("Safepay webhook error:", err);
  }
});

// GET /safepay/status/:bookingId - Poll payment status
router.get("/status/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).select(
      "paymentStatus paymentMode safepayTracker safepayResponseState paidAt totalPrice packageName"
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.paymentStatus === "paid" || booking.paymentStatus === "failed") {
      return res.json({
        success: true,
        bookingId: booking._id,
        paymentStatus: booking.paymentStatus,
        paidAt: booking.paidAt,
        totalPrice: booking.totalPrice,
        packageName: booking.packageName,
      });
    }

    if (booking.safepayTracker && booking.paymentStatus === "pending") {
      try {
        const { safepay } = getSafepay();
        const trackerResponse = await safepay.reporter.payments.fetch(booking.safepayTracker);
        const trackerState = trackerResponse?.data?.tracker?.state;

        if (trackerState === "TRACKER_ENDED") {
          booking.paymentStatus = "paid";
          booking.safepayResponseState = "TRACKER_ENDED";
          booking.paidAt = new Date();
          await booking.save();
        } else if (trackerState === "TRACKER_FAILED" || trackerState === "TRACKER_CANCELLED") {
          booking.paymentStatus = "failed";
          booking.safepayResponseState = trackerState;
          await booking.save();
        }
      } catch (pollErr) {
        console.log("Safepay tracker poll error:", pollErr.message);
      }
    }

    return res.json({
      success: true,
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
      paidAt: booking.paidAt,
      totalPrice: booking.totalPrice,
      packageName: booking.packageName,
    });

  } catch (err) {
    console.error("Payment status check error:", err);
    return res.status(500).json({ error: "Failed to check payment status" });
  }
});

// GET /safepay/result - HTML page shown after payment in WebView
router.get("/result", (req, res) => {
  const { status, bookingId } = req.query;
  const isSuccess = status === "success";

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex; justify-content: center; align-items: center;
          min-height: 100vh; margin: 0;
          background: ${isSuccess ? "#f0fdf4" : "#fef2f2"};
        }
        .card {
          text-align: center; padding: 40px 24px; border-radius: 16px;
          background: white; box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          max-width: 340px; margin: 20px;
        }
        .icon { font-size: 64px; margin-bottom: 16px; }
        h2 { color: ${isSuccess ? "#166534" : "#991b1b"}; margin: 0 0 8px; }
        p { color: #6b7280; margin: 0 0 16px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">${isSuccess ? "✅" : "❌"}</div>
        <h2>${isSuccess ? "Payment Successful!" : "Payment Cancelled"}</h2>
        <p>${isSuccess
          ? "Your booking has been confirmed. You can close this window."
          : "Payment was not completed. You can close this window and try again."
        }</p>
        <p style="font-size:12px;color:#9ca3af;">Booking: ${bookingId || "N/A"}</p>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
