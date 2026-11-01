
import { useState } from "react";
import { findCustomerByPhone } from "../api.js";
import Alert from "../components/Alert.jsx";

const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export default function Dashboard({ onBack, onContinue }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError(
        "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9."
      );
      return;
    }

    setLoading(true);

    try {
      let customer = null;

      try {
        customer = await findCustomerByPhone(phone);
      } catch (err) {
        if (err.status !== 404) throw err;
      }

      onContinue({ phone, customer, marketingOptIn });
    } catch (err) {
      setError(err.message || "Unable to check the mobile number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#174D38] text-3xl text-white">
          🛒
        </div>

        <h1 className="text-3xl font-bold text-[#174D38]">
          Welcome to Green Basket Mart
        </h1>

        <p className="mt-2 text-gray-500">
          Enter your mobile number to continue with your payment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-green-100 bg-white p-6 shadow-lg sm:p-8"
      >
        <h2 className="mb-6 text-xl font-bold text-[#174D38]">
          Your Details
        </h2>

        <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#174D38]">
          Mobile Number
        </label>

        <div className="flex">
          <span className="grid place-items-center rounded-l-xl border-2 border-r-0 border-green-200 bg-green-50 px-4 font-bold text-[#174D38]">
            +91
          </span>

          <input
            id="phone"
            className="w-full rounded-r-xl border-2 border-green-200 px-4 py-3 outline-none transition focus:border-[#174D38] focus:ring-2 focus:ring-green-100"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Your number helps us associate your payment and receipt.
        </p>

        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#174D38]"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />

            <span className="text-sm text-[#174D38]">
              I agree to receive promotional offers and updates from Green
              Basket Mart via SMS, WhatsApp, or email.
            </span>
          </label>

          <p className="mt-2 text-xs text-gray-500">
            Optional. You can continue with payment without agreeing.
          </p>
        </div>

        <Alert>{error}</Alert>

        <button
          className="mt-5 w-full rounded-xl bg-[#174D38] px-5 py-3 font-semibold text-white transition hover:bg-[#245D43] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Checking..." : "Continue to Payment →"}
        </button>

        <button
          type="button"
          className="mt-3 w-full rounded-xl border-2 border-[#174D38] px-5 py-3 font-semibold text-[#174D38] transition hover:bg-green-50"
          onClick={onBack}
          disabled={loading}
        >
          ← Back to QR Page
        </button>
      </form>
    </section>
  );
}
