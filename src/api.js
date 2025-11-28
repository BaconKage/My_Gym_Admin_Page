import axios from "axios";

const API_BASE = "https://my-gym-admin-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

// Dashboard numbers
export async function fetchDashboardStats() {
  try {
    const res = await api.get("/api/dashboard");
    return res.data;
  } catch (err) {
    // fall back to /dashboard if /api/dashboard doesn't exist
    if (err.response && err.response.status === 404) {
      const res2 = await api.get("/dashboard");
      return res2.data;
    }
    throw err;
  }
}

// All collection counts (you already saw this JSON earlier)
export async function fetchCollectionsMeta() {
  const res = await api.get("/meta");
  return res.data; // [{ name: "exercises", count: 664 }, ...]
}

// Paginated docs for a specific collection
export async function fetchCollectionData(name, page = 1, limit = 20) {
  const res = await api.get(
    `/collections/${encodeURIComponent(name)}?page=${page}&limit=${limit}`
  );
  return res.data; // { name, page, limit, total, docs: [...] }
}
