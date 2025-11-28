import axios from "axios";

const API = axios.create({
  baseURL: "https://my-gym-admin-backend.onrender.com/api",
});

export async function fetchDashboardStats() {
  const res = await API.get("/dashboard");
  return res.data; // { totalActivities, totalDailyStepsRecords, totalExercises, activeChallenges, openCarts, totalConversations }
}
