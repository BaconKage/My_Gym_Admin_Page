import axios from "axios";

const API_BASE = "https://my-gym-admin-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

// Try /api/dashboard first, fall back to /dashboard
export async function fetchDashboardStats() {
  try {
    const res = await api.get("/api/dashboard");
    return res.data;
  } catch (err) {
    // If 404, try without /api prefix
    if (err.response && err.response.status === 404) {
      const res2 = await api.get("/dashboard");
      return res2.data;
    }
    console.error("Dashboard stats request failed:", err);
    throw err;
  }
}
