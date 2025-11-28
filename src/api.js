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
  } catch (err: any) {
    // fall back to /dashboard if /api/dashboard doesn't exist
    if (err.response && err.response.status === 404) {
      const res2 = await api.get("/dashboard");
      return res2.data;
    }
    throw err;
  }
}

// ✅ All collection counts (now uses /api/meta)
export async function fetchCollectionsMeta() {
  const res = await api.get("/api/meta");
  return res.data; // [{ name: "exercises", count: 664 }, ...]
}

// ✅ Paginated docs for a specific collection (now /api/collections/...)
export async function fetchCollectionData(
  name: string,
  page: number = 1,
  limit: number = 20
) {
  const res = await api.get(
    `/api/collections/${encodeURIComponent(name)}?page=${page}&limit=${limit}`
  );
  return res.data; // { name, page, limit, total, docs: [...] }
}
