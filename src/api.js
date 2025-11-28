import axios from "axios";

const API = axios.create({
  baseURL: "https://my-gym-admin-backend.onrender.com",
  // if you ever add auth tokens later, you can use headers here
});

export async function fetchDashboardStats() {
  const res = await API.get("/dashboard");
  return res.data; // { totalActivities, totalDailyStepsRecords, ... }
}

export async function fetchCollectionsMeta() {
  const res = await API.get("/meta");
  return res.data; // [{ name: "exercises", count: 664 }, ...]
}
