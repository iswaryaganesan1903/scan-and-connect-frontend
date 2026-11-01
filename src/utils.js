// Formats a number as Indian rupees, e.g. 1250 -> "₹1,250.00"
export function formatINR(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
