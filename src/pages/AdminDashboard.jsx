import { useEffect, useState } from "react";
import {
  getTotalCustomers,
  getAllPaymentsWithCustomerDetails
} from "../api.js";
function StatCard({ title, value, icon, description }) {
  return (
    <div className="rounded-2xl border border-[#E3E9DF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500">
          {title}
        </h2>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#E8F2E8] text-xl text-[#174D38]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold text-[#174D38]">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [allPayments, setAllPayments] = useState([]);

  const successfulPayments = allPayments.filter(
    payment => payment.status === "SUCCESS"
  );

  const totalRevenue = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const [customers, allPaymentRecords] = await Promise.all([
          getTotalCustomers(),
          getAllPaymentsWithCustomerDetails()
        ]);

        setTotalCustomers(customers);
        setAllPayments(allPaymentRecords);
      }
      catch (err) {
        setError(err.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-[#174D38]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Dashboard heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#174D38]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Welcome to Green Basket Mart. Here's your store's activity overview.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon="♙"
          description="Customers registered in your store"
        />

        <StatCard
          title="Total Revenue"
          value={`₹ ${Number(totalRevenue).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon="₹"
          description="Revenue from successful payments"
        />

        <StatCard
          title="Successful Payments"
          value={successfulPayments.length}
          icon="✓"
          description="Payments completed successfully"
        />


      </div>

      {/* Recent Payments */}
      <div className="overflow-hidden rounded-2xl border border-[#E3E9DF] bg-white shadow-sm">
        <div className="border-b border-[#E3E9DF] p-6">
          <h2 className="text-lg font-bold text-[#174D38]">
            Recent Payments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest payment transactions from your store
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F7F1] text-gray-600">
              <tr>
                <th className="px-6 py-4">Payment ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E3E9DF]">
              {allPayments.length > 0 ? (
                [...allPayments].reverse().slice(0, 5).map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-[#F5F7F1]">
                    <td className="px-6 py-4 font-medium text-gray-700">
                      #{payment.paymentId}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleString("en-IN")
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {payment.customerPhone}
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#174D38]">
                      ₹{Number(payment.amount).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {payment.paymentMethod || "Not available"}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}