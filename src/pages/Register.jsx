
import { useState } from "react";
import { createCustomer } from "../api.js";
import Alert from "../components/Alert.jsx";

export default function Register({ phone, onBack, onRegistered }) {
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const customer = await createCustomer({
        phone: phone,
        marketingOptIn: consent,
      });

      onRegistered(customer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#174D38] text-3xl text-white">
          👤
        </div>

        <h1 className="text-3xl font-bold text-[#174D38]">
          Customer Details
        </h1>

        <p className="mt-2 text-gray-500">
          Confirm your mobile number and continue to payment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-green-100 bg-white p-6 shadow-lg sm:p-8"
      >
        <label
          htmlFor="phone-ro"
          className="mb-2 block text-sm font-semibold text-[#174D38]"
        >
          Mobile Number
        </label>

        <input
          id="phone-ro"
          className="w-full rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 font-medium text-[#174D38] outline-none"
          value={`+91 ${phone}`}
          readOnly
        />

        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-[#174D38]"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />

            <span className="text-sm text-[#174D38]">
              Send me offers and updates by SMS or WhatsApp.

              <span className="mt-1 block text-xs text-gray-500">
                Optional. You can say no and still pay.
              </span>
            </span>
          </label>
        </div>

        <Alert>{error}</Alert>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="w-2/5 rounded-xl border-2 border-[#174D38] px-4 py-3 font-semibold text-[#174D38] transition hover:bg-green-50"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>

          <button
            className="flex-1 rounded-xl bg-[#174D38] px-4 py-3 font-semibold text-white transition hover:bg-[#245D43] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>
      </form>
    </section>
  );
}
