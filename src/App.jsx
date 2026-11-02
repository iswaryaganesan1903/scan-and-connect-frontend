import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";



import Header from "./components/Header.jsx";
import Welcome from "./pages/Welcome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Payment from "./pages/Payment.jsx";
import Success from "./pages/Success.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Customers from "./pages/Customers.jsx";
import Payments from "./pages/Payments.jsx";
import Advertisements from "./pages/Advertisements.jsx";
import ThankYou from "./pages/ThankYou.jsx";


function CustomerFlow() {
  const [step, setStep] = useState(
    new URLSearchParams(window.location.search).get("step") === "dashboard"
      ? "dashboard"
      : "welcome"
  );

  const [bill, setBill] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [result, setResult] = useState(null);

  function restart() {
    setBill(null);
    setCustomer(null);
    setResult(null);
    setStep("welcome");
  }

  // Show Thank You page separately
  if (step === "thankyou") {
    return <ThankYou />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header step={step} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
        {step === "welcome" && (
          <Welcome onContinue={() => setStep("dashboard")} />
        )}

        {step === "dashboard" && (
          <Dashboard
            onBack={restart}
            onContinue={({ phone, customer: found, marketingOptIn }) => {
              setBill({ phone, marketingOptIn });
              setCustomer(found);
              setStep("payment");
            }}
          />
        )}

        {step === "payment" && (
          <Payment
            customer={customer}
            bill={bill}
            onBack={() => setStep("dashboard")}
            onResult={(r) => {
              setResult(r);

              if (r?.status === "SUCCESS") {
                setStep("thankyou");
              } else {
                setStep("result");
              }
            }}
          />
        )}

        {step === "result" && (
          <Success
            customer={customer}
            result={result}
            onDone={restart}
          />
        )}
      </main>

      <footer className="border-t border-mint-200 bg-white py-5 text-center text-sm text-muted">
        Scan &amp; Connect · Smart Retail Engagement System
      </footer>
    </div>
  );
}


export default function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route
          path="qr"
          element={
            <Welcome
              onContinue={() => navigate("/shop?step=dashboard")}
            />
          }
        />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
        <Route path="advertisements" element={<Advertisements />} />
      </Route>

      {/* Customer flow */}
      <Route path="/shop" element={<CustomerFlow />} />

      {/* Default page */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}