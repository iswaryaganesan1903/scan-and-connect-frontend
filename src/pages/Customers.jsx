
import { useEffect, useState } from "react";
import { getAllCustomers } from "../api.js";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (err) {
        setError(err.message || "Unable to load customers");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.phone, customer.email]
      .some((value) =>
        String(value || "").toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#174D38]">
          Customers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your registered customers.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total Customers
        </p>
        <p className="mt-2 text-3xl font-bold text-[#174D38]">
          {customers.length}
        </p>
      </div>

      {/* Customer table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-[#174D38]">
            Customer List
          </h2>

          <input
            type="text"
            placeholder="Search name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#174D38] focus:ring-2 focus:ring-green-100 sm:max-w-xs"
          />
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-500">
            Loading customers...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">
            {error}
          </p>
        ) : filteredCustomers.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No customers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F7F1] text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">#</th>        
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Marketing</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-[#F8FAF6]"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {index + 1}
                    </td>                  
                    <td className="px-5 py-4 text-gray-600">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.marketingOptIn
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {customer.marketingOptIn ? "Opted In" : "Not Opted In"}
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
