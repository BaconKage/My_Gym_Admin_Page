import axios from "axios";

// IMPORTANT: your backend's base URL
const API = axios.create({
  baseURL: "https://my-gym-admin-backend.onrender.com/api",
});

export async function fetchDashboardStats() {
  const res = await API.get("/dashboard");
  return res.data;
}

export async function fetchCollectionsMeta() {
  const res = await API.get("/meta");
  return res.data;
}
