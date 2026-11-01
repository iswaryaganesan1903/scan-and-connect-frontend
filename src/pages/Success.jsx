
import Alert from "../components/Alert.jsx";
import { formatINR } from "../utils.js";

// One result page for every outcome.
const VIEW = {
  SUCCESS: {
    title: "Payment successful",
    icon: "✓",
    iconBg: "bg-[#174D38]",
    alert: "success",
    text: "Your payment was verified. Thank you for shopping with us!",
  },
  FAILED: {
    title: "Payment failed",
    icon: "✕",
    iconBg: "bg-red-600",
    alert: "error",
    text: "This payment was not completed. You can go back and try again.",
  },
  UNVERIFIED: {
    title: "Payment not confirmed",
    icon: "!",
    iconBg: "bg-amber-500",
    alert: "warning",
    text: "We could not confirm this payment yet. Please do not pay again. Show the reference below to the shop.",
  },
};

export default function Success({ customer, result, onDone }) {
  const view = VIEW[result.status] || VIEW.UNVERIFIED;

  const rows = [
    ["Status", result.status === "UNVERIFIED" ? "Not confirmed" : result.status === "SUCCESS" ? "Paid" : "Failed"],
    ["Amount", formatINR(result.amount)],
    ["Customer", customer?.name],
    ["Payment reference", result.paymentRef],
    ["Order ID", result.orderId],
  ].filter(([, value]) => value);

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60">

        {/* Top section */}
        <div className="bg-[#174D38] px-6 py-8 text-center text-white">
          <p className="text-sm font-medium tracking-widest text-green-100">
            GREEN BASKET MART
          </p>
          <p className="mt-2 text-xs text-green-100">
            Scan & Connect
          </p>
        </div>

        {/* Result icon */}
        <div className="px-6 pt-8 text-center">
          <div
            className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-4xl font-bold text-white shadow-lg ${view.iconBg}`}
          >
            {view.icon}
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#174D38] sm:text-3xl">
            {view.title}
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            {view.text}
          </p>
        </div>

        {/* Alert and message */}
        <div className="px-6 pt-5">
          {result.message && (
            <p className="mb-3 rounded-xl bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
              <span className="font-semibold">Details: </span>
              {result.message}
            </p>
          )}
        </div>

        {/* Transaction details */}
        <div className="mx-6 mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-3 text-left text-sm font-bold uppercase tracking-wider text-[#174D38]">
            Transaction Details
          </h2>

          <dl className="divide-y divide-gray-200 text-sm">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-3"
              >
                <dt className="shrink-0 text-gray-500">{label}</dt>
                <dd className="break-all text-right font-semibold text-gray-800">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Action */}
        <div className="px-6 py-7">
          <button
            className="w-full rounded-xl bg-[#174D38] px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#245D43] active:scale-[0.98] disabled:cursor-not-allowed"
            onClick={onDone}
          >
            Start a New Bill
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Thank you for choosing Green Basket Mart!
          </p>
        </div>
      </div>
    </section>
  );
}
