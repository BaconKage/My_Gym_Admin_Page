// src/fakeApi.js
// Backwards-compat shim so any old "../fakeApi" imports still work.
// Internally this just calls the new real API functions from api.ts/js.

import { fetchDashboardStats } from "./api";

export async function getDashboardStats() {
  return fetchDashboardStats();
}
