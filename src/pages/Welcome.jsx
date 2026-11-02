
import { QRCodeSVG } from "qrcode.react";
import { SHOP, DASHBOARD_URL } from "../config.js";
import Alert from "../components/Alert.jsx";

export default function Welcome({ onContinue }) {
  const isLocalhost = DASHBOARD_URL.includes("localhost");

  return (
    <section className="mx-auto w-full max-w-lg rounded-3xl border border-green-100 bg-white p-6 text-center shadow-xl sm:p-8">

      {/* Shop Header */}
      <div className="mb-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
          🛒
        </div>

        <h1 className="text-3xl font-extrabold text-green-900">
          Welcome to {SHOP.name}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {SHOP.tagline}
        </p>
      </div>

      {/* QR Code */}
      <div className="mx-auto w-fit rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
        <QRCodeSVG
          value={DASHBOARD_URL}
          size={208}
          level="M"
          fgColor="#0f4430"
          bgColor="#f1faf5"
        />
      </div>

      {/* Scan Instructions */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-green-900">
          Scan to Pay
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Point your phone camera at the code to open your checkout.
        </p>

        <p className="mt-3 break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          {DASHBOARD_URL}
        </p>
      </div>


      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-xl bg-[#174D38] px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-900 active:scale-95"
      >
        Continue to Dashboard →
      </button>

      <p className="mt-5 text-xs text-gray-400">
        © {SHOP.name} · Smart Retail Engagement System
      </p>
    </section>
  );
}
