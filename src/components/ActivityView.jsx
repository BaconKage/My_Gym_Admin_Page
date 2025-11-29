// src/components/ActivityView.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

function ActivityView() {
  const [data, setData] = useState({ docs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetchCollectionData("activities", 1, 100);
        setData(res);
      } catch (err) {
        console.error("Failed to load activities", err);
        setError("Failed to load activities from MongoDB.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const docs = Array.isArray(data.docs) ? data.docs : [];

  // --- helpers ---------------------------------------------------

  const normalizeId = (value) => {
    if (!value) return "-";
    if (typeof value === "string") return value;
    if (value.$oid) return value.$oid;
    return String(value);
  };

  const formatDate = (value) => {
    if (!value) return "-";

    let raw = value;
    if (typeof value === "object") {
      if (value.$date) raw = value.$date;
      else if (value.$numberLong) raw = Number(value.$numberLong);
    }

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const getActionStats = (actions, key) => {
    const a = actions?.[key] || {};
    return {
      count: a.count || 0,
      last: formatDate(a.lastActivityTime),
      notesCount: Array.isArray(a.notes) ? a.notes.length : 0,
    };
  };

  // --- build UI rows from your schema ----------------------------

  const rows = docs
    .filter((d) => d && typeof d === "object")
    .map((doc) => {
      const actions = doc.actions || {};

      const login = getActionStats(actions, "Login");
      const workout = getActionStats(actions, "WorkoutPlan");
      const diet = getActionStats(actions, "DietPlan");
      const contest = getActionStats(actions, "Contest");

      return {
        id: normalizeId(doc._id),
        userId: normalizeId(doc.userId),
        lastUpdated: formatDate(doc.lastUpdated),

        loginCount: login.count,
        lastLogin: login.last,

        workoutCount: workout.count,
        lastWorkout: workout.last,

        dietCount: diet.count,
        contestCount: contest.count,
      };
    });

  const totalLogins = rows.reduce((sum, r) => sum + (r.loginCount || 0), 0);
  const totalWorkouts = rows.reduce(
    (sum, r) => sum + (r.workoutCount || 0),
    0
  );

  const activeUsers = rows.filter((r) => r.loginCount > 0).length;

  // --- render ----------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* VERY OBVIOUS TITLE so we know this file is live */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Activity Overview – NEW LAYOUT
        </h1>
        <p className="text-muted-foreground text-sm">
          User engagement from the <code>activities</code> collection. Each row
          shows one member&apos;s logins, workouts, diet and contest usage.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tracked users</CardTitle>
            <CardDescription className="text-xs">
              Total documents in <code>activities</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {data.total || rows.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total logins</CardTitle>
            <CardDescription className="text-xs">
              Sum of all login counts across users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalLogins}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Workout actions</CardTitle>
            <CardDescription className="text-xs">
              Total workout-plan interactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalWorkouts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active users</CardTitle>
            <CardDescription className="text-xs">
              Users with at least one login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{activeUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User activity breakdown</CardTitle>
          <CardDescription className="text-xs">
            How each member is using the app – logins, workouts, diet and
            contests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading activities…
            </div>
          ) : error ? (
            <div className="py-4 text-sm text-red-200 bg-red-500/10 border border-red-500/40 rounded-lg">
              {error}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No activity documents found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">User ID</th>
                    <th className="text-left py-2 px-3">Last updated</th>
                    <th className="text-left py-2 px-3">Login count</th>
                    <th className="text-left py-2 px-3">Last login</th>
                    <th className="text-left py-2 px-3">Workout actions</th>
                    <th className="text-left py-2 px-3">Diet actions</th>
                    <th className="text-left py-2 px-3">Contest actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-2 px-3 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px]">
                        {row.userId}
                      </td>
                      <td className="py-2 px-3">{row.lastUpdated}</td>
                      <td className="py-2 px-3">{row.loginCount}</td>
                      <td className="py-2 px-3">{row.lastLogin}</td>
                      <td className="py-2 px-3">{row.workoutCount}</td>
                      <td className="py-2 px-3">{row.dietCount}</td>
                      <td className="py-2 px-3">{row.contestCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ActivityView;
