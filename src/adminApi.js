import { API_BASE_URL } from "./config.js";

// POST /api/admin/login  ->  200 if the username and password are correct, 401 if not
export async function adminLogin(username, password) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  if (response.status === 401) {
    throw new Error("Incorrect username or password.");
  }
  if (!response.ok) {
    throw new Error("Login failed. Please try again.");
  }
}