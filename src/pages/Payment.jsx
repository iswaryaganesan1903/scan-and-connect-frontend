
import { useState } from "react";
import { SHOP } from "../config.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../api.js";
import { formatINR } from "../utils.js";
import Alert from "../components/Alert.jsx";

function loadCheckoutScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Payment({ customer, bill, onBack, onResult }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handlePay() {
    setError("");
    setMessage("");

    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than ₹0.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      setError("Enter an amount with up to 2 decimal places.");
      return;
    }

    setLoading(true);
    setMessage("Preparing secure payment…");

    try {
      if (!(await loadCheckoutScript())) {
        throw new Error("Could not load Razorpay. Check your internet connection.");
      }

      const order = await createRazorpayOrder({
        phone: customer?.phone || bill?.phone,
        amount: numericAmount,
        marketingOptIn: bill?.marketingOptIn ?? false,
      });

      if (!order?.orderId || !order?.keyId) {
        throw new Error("The server did not return a valid payment order.");
      }

      openCheckout(order, numericAmount);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setMessage("");
    }
  }

  function openCheckout(order, paymentAmount) {
    let failure = null;

    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: SHOP.name,
      description: "Bill payment",
      prefill: { contact: customer?.phone || bill?.phone || "" },
      theme: { color: "#174D38" },

      handler: (response) => confirmWithBackend(order, response, paymentAmount),

      modal: {
        ondismiss: () => {
          setLoading(false);
          setMessage("");

          if (failure) {
            onResult(failure);
          } else {
            setError("Payment window closed. Please try again if you have not paid.");
          }
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      failure = {
        status: "FAILED",
        amount: paymentAmount,
        orderId: order.orderId,
        paymentRef: resp.error?.metadata?.payment_id,
        message: resp.error?.description || "The payment could not be completed.",
      };
    });

    setMessage("Complete the payment in the Razorpay window.");
    rzp.open();
  }

  async function confirmWithBackend(order, response, paymentAmount) {
    setMessage("Confirming your payment…");

    try {
      const data = await verifyRazorpayPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });

      console.log("Backend verification response:", data);

      const backendStatus = String(data?.status || "").toUpperCase();

      onResult({
        status:
          backendStatus === "SUCCESS"
            ? "SUCCESS"
            : backendStatus === "FAILED"
              ? "FAILED"
              : "UNVERIFIED",
        amount: data?.amount ?? paymentAmount,
        paymentRef: data?.razorpayPaymentId || response.razorpay_payment_id,
        orderId: data?.razorpayOrderId || order.orderId,
        message: data?.message,
      });
    } catch (err) {
      onResult({
        status: "UNVERIFIED",
        amount: paymentAmount,
        paymentRef: response.razorpay_payment_id,
        orderId: order.orderId,
        message: err.message,
      });
    }
  }

  return (
    <section className="mx-auto max-w-xl">

      {/* Heading */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#174D38] text-3xl text-white">
          ₹
        </div>

        <h1 className="text-3xl font-bold text-[#174D38]">
          Customer Payment
        </h1>

        <p className="mt-2 text-gray-500">
          Enter the amount you have to pay.
        </p>
      </div>

      {/* Payment Card */}
      <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-lg sm:p-8">

        {/* Mobile Number */}
        <label htmlFor="mobile" className="mb-2 block text-sm font-semibold text-[#174D38]">
          Mobile Number
        </label>

        <input
          id="mobile"
          className="w-full rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 font-medium text-[#174D38] outline-none"
          value={`+91 ${customer?.phone || bill?.phone || ""}`}
          readOnly
        />

        {/* Amount */}
        <label htmlFor="amount" className="mb-2 mt-6 block text-sm font-semibold text-[#174D38]">
          Amount (₹)
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#174D38]">
            ₹
          </span>

          <input
            id="amount"
            className="w-full rounded-xl border-2 border-green-200 py-3 pl-10 pr-4 text-lg font-semibold text-[#174D38] outline-none transition focus:border-[#174D38] focus:ring-2 focus:ring-green-100"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Amount Preview */}
        {Number(amount) > 0 && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-gray-500">Total amount to pay</p>
            <p className="mt-1 text-2xl font-bold text-[#174D38]">
              {formatINR(Number(amount))}
            </p>
          </div>
        )}

        {/* Alerts */}
        <div className="mt-4">
          <Alert type="success">{message}</Alert>
          <Alert>{error}</Alert>
        </div>

        {/* Pay Button */}
        <button
          className="mt-5 w-full rounded-xl bg-[#174D38] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#245D43] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handlePay}
          disabled={loading}
        >
          {loading
            ? "Please wait…"
            : `Pay ${amount && Number(amount) > 0 ? formatINR(Number(amount)) : "with Razorpay"} →`}
        </button>

        {/* Back Button */}
        <button
          className="mt-3 w-full rounded-xl border-2 border-[#174D38] px-5 py-3 font-semibold text-[#174D38] transition hover:bg-green-50"
          onClick={onBack}
          disabled={loading}
        >
          ← Back
        </button>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 border-t border-green-100 pt-4">
          <span className="text-[#174D38]">🔒</span>
          <p className="text-center text-xs text-gray-500">
            Payments are processed securely by Razorpay.
          </p>
        </div>
      </div>
    </section>
  );
}
