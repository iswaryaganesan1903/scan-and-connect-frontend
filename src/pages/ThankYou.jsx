export default function ThankYou() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F1] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">

        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#174D38]">
          Thank You!
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment was successful.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Thank you for shopping with Green Basket Mart.
        </p>

      </div>
    </div>
  );
}