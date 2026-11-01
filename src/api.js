import { API_BASE_URL } from "./config.js";

// Small helper used by the POST functions below.
async function postJson(path, body, errorMessage) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  if (!response.ok) {
    // Show the backend's own message if it sent one
    let message = errorMessage;
    try {
      const data = await response.json();
      message = data.message || message;
    } catch { /* body was not JSON */ }
    throw new Error(message);
  }
  return await response.json();
}

// ---------- EXISTING functions (same URLs and behaviour as before) ----------

// 1. Find customer using phone number. Returns null if not found.
export async function findCustomerByPhone(phone) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/customers/phone/${phone}`);
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to find customer");
  return await response.json();
}

// 2. Create a new customer
export function createCustomer(customer) {
  return postJson("/api/customers", customer, "Unable to register customer");
}

// 3. Create a payment record (kept for compatibility; the checkout no longer calls it
//    directly, because a payment must only be saved as paid after verification).
export function createPayment(payment) {
  return postJson("/api/payments", payment, "Payment failed");
}

// ---------- NEW functions (need backend endpoints, see the backend notes) ----------

// 4. Ask the backend to create a Razorpay order.
//    Send:    { customerId, amount }            (amount in rupees)
//    Receive: { orderId, keyId, amount, currency }   (amount in paise)
export function createRazorpayOrder(data) {
  return postJson("/api/payments/razorpay/order", data, "Could not start the payment");
}

// 5. Ask the backend to verify the payment signature and save the result.
//    Send:    { razorpayOrderId, razorpayPaymentId, razorpaySignature }
//    Receive: { status: "SUCCESS" | "FAILED", amount, razorpayPaymentId, razorpayOrderId, message }
export function verifyRazorpayPayment(data) {
  return postJson("/api/payments/razorpay/verify", data, "Could not verify the payment");
}

export async function getTotalCustomers() {
  const response = await fetch(`${API_BASE_URL}/api/customers/count`);

  if (!response.ok) {
    throw new Error("Unable to fetch customer count");
  }

  return await response.json();
}

export async function getTotalRevenue() {
  const response = await fetch(`${API_BASE_URL}/api/payments/revenue`);

  if (!response.ok) {
    throw new Error("Unable to fetch total revenue");
  }

  return await response.json();
}

export async function getSuccessfulPayments() {
  const response = await fetch(`${API_BASE_URL}/api/payments/successful`);

  if (!response.ok) {
    throw new Error("Unable to fetch successful payments");
  }

  return await response.json();
}

export async function getAllPayments() {
  const response = await fetch(`${API_BASE_URL}/api/payments`);

  if (!response.ok) {
    throw new Error("Unable to fetch all payments");
  }

  return await response.json();
}
export async function getAllPaymentsWithCustomerDetails() {
  const response = await fetch(
    `${API_BASE_URL}/api/payments/with-customer-details`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch payment details");
  }

  return await response.json();
}

// Get all registered customers
export async function getAllCustomers() {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/customers`);
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  if (!response.ok) {
    throw new Error("Unable to fetch customers");
  }

  return await response.json();
}

export async function getAllAdvertisements() {
  const response = await fetch(
    `${API_BASE_URL}/api/advertisements`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch advertisements");
  }

  return await response.json();
}

export async function createAdvertisement(advertisement) {
  return postJson(
    "/api/advertisements",
    advertisement,
    "Unable to create advertisement"
  );
}

export async function updateAdvertisement(id, advertisement) {
  const response = await fetch(
    `${API_BASE_URL}/api/advertisements/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(advertisement),
    }
  );

  if (!response.ok) {
    throw new Error("Unable to update advertisement");
  }

  return await response.json();
}

export async function deleteAdvertisement(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/advertisements/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to delete advertisement");
  }
}
export async function getMarketingCustomers() {
  const response = await fetch(
    `${API_BASE_URL}/api/customers/marketing`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch marketing customers");
  }

  return await response.json();
}