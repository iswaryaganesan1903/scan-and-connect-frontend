
import { useEffect, useState } from "react";
import { getAllPaymentsWithCustomerDetails } from "../api.js";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const data = await getAllPaymentsWithCustomerDetails();
        setPayments(data);
      } catch (err) {
        setError(err.message || "Unable to load payments");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  // Format amount in Indian Rupees
  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  }

  // Filter payments by search and status
  const filteredPayments = payments.filter((payment) => {
    const searchMatch =
      String(payment.paymentId || "").includes(search) ||
      String(payment.customerPhone || "").includes(search);

    const statusMatch =
      statusFilter === "ALL" ||
      payment.status?.toUpperCase() === statusFilter;

    return searchMatch && statusMatch;
  });

  function getStatusStyle(status) {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  const successfulPayments = payments.filter(
    (p) => p.status?.toUpperCase() === "SUCCESS"
  ).length;

  const pendingPayments = payments.filter(
    (p) => p.status?.toUpperCase() === "PENDING"
  ).length;

  const failedPayments = payments.filter(
    (p) => p.status?.toUpperCase() === "FAILED"
  ).length;

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#174D38]">
          Payments
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and monitor all customer transactions.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Payments</p>
          <p className="mt-2 text-3xl font-bold text-[#174D38]">
            {payments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Successful</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {successfulPayments}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-500">
            {pendingPayments}
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {failedPayments}
          </p>
        </div>

      </div>

      {/* Payment list */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <h2 className="font-bold text-[#174D38]">
            Transaction History
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              placeholder="Search payment ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#174D38] focus:ring-2 focus:ring-green-100"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#174D38]"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-500">
            Loading payments...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">
            {error}
          </p>
        ) : filteredPayments.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No payments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-[#F5F7F1] text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Payment ID</th>
                  <th className="px-5 py-4 font-semibold">Customer Phone</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Method</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.paymentId}
                    className="transition hover:bg-[#F8FAF6]"
                  >
                    <td className="px-5 py-4 font-medium text-gray-700">
                      #{payment.paymentId}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {payment.customerPhone || "—"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {payment.paymentMethod || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(payment.status)}`}
                      >
                        {payment.status || "UNKNOWN"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
