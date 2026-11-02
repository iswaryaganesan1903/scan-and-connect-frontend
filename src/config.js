// Change shop details here.
export const SHOP = {
  name: "Green Basket Mart",
  tagline: "Scan, pay and stay in touch.",
};

// Backend address. To test from a phone, create a file named .env in the project
// root containing:  VITE_API_URL=http://YOUR_PC_IP:8089
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://scan-and-connect-backend.onrender.com";

// The address the QR code opens. A phone cannot open "localhost", so for phone
// testing put this in .env:  VITE_PUBLIC_URL=http://YOUR_PC_IP:5173
// After deployment, set it to your real website address.
const publicUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
export const DASHBOARD_URL = `${publicUrl}/shop?step=dashboard`;