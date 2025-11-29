import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

const formatDateTime = (value) => {
  if (!value) return "-";

  // Mongo date shape: { $date: "2025-11-28T03:38:22.366Z" } OR ISO string
  const iso =
    typeof value === "string"
      ? value
      : typeof value === "object" && value.$date
      ? value.$date
      : null;

  if (!iso) return "-";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function ActivityView() {
  const [data, setData] = useState({ docs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetchCollectionData("activities", 1, 50);
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

  const docs = data.docs || [];

  // Build rows in a human-readable way
  const rows = docs.map((doc) => {
    const actions = doc.actions || {};

    const login = actions.Login || {};
    const workout = actions.WorkoutPlan || {};
    const contest = actions.Contest || {};
    const diet = actions.DietPlan || {};

    return {
      id: doc._id || doc.userId,
      userId: doc.userId,
      lastUpdated: doc.lastUpdated,
      loginCount: login.count || 0,
      lastLoginAt: login.lastActivityTime,
      workoutCount: workout.count || 0,
      lastWorkoutAt: workout.lastActivityTime,
      contestCount: contest.count || 0,
      dietCount: diet.count || 0,
    };
  });

  const summary = rows.reduce(
    (acc, row) => {
      acc.users += 1;
      acc.totalLogins += row.loginCount;
      acc.totalWorkouts += row.workoutCount;
      acc.totalContests += row.contestCount;
      acc.totalDietUpdates += row.dietCount;
      return acc;
    },
    {
      users: 0,
      totalLogins: 0,
      totalWorkouts: 0,
      totalContests: 0,
      totalDietUpdates: 0,
    }
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Activity Overview</h1>
        <p className="text-muted-foreground text-sm">
          High-level view of how users are interacting with MyGym (logins,
          workouts, contests, diet plan usage).
        </p>
      </div>

      {/* Summary cards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Showing up to 50 most recent activity records from{" "}
            <code>activities</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Users tracked
            </p>
            <p className="text-base font-semibold">{summary.users}</p>
          </div>
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/40 px-3 py-2">
            <p className="text-[11px] text-blue-100 mb-1">Total logins</p>
            <p className="text-base font-semibold text-blue-200">
              {summary.totalLogins}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/40 px-3 py-2">
            <p className="text-[11px] text-emerald-100 mb-1">Workouts</p>
            <p className="text-base font-semibold text-emerald-200">
              {summary.totalWorkouts}
            </p>
          </div>
          <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/40 px-3 py-2">
            <p className="text-[11px] text-yellow-100 mb-1">Contest events</p>
            <p className="text-base font-semibold text-yellow-200">
              {summary.totalContests}
            </p>
          </div>
          <div className="rounded-lg bg-pink-500/5 border border-pink-500/40 px-3 py-2">
            <p className="text-[11px] text-pink-100 mb-1">Diet plan updates</p>
            <p className="text-base font-semibold text-pink-200">
              {summary.totalDietUpdates}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">User activity details</CardTitle>
          <CardDescription className="text-xs">
            Each row is one user&apos;s activity document in{" "}
            <code>activities</code>.
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
                    <th className="text-left py-2 px-3">Logins</th>
                    <th className="text-left py-2 px-3">Last login</th>
                    <th className="text-left py-2 px-3">Workouts</th>
                    <th className="text-left py-2 px-3">Last workout</th>
                    <th className="text-left py-2 px-3">Contests</th>
                    <th className="text-left py-2 px-3">Diet updates</th>
                    <th className="text-left py-2 px-3">Last updated</th>
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
                        {row.userId || "-"}
                      </td>
                      <td className="py-2 px-3">{row.loginCount}</td>
                      <td className="py-2 px-3">
                        {formatDateTime(row.lastLoginAt)}
                      </td>
                      <td className="py-2 px-3">{row.workoutCount}</td>
                      <td className="py-2 px-3">
                        {formatDateTime(row.lastWorkoutAt)}
                      </td>
                      <td className="py-2 px-3">{row.contestCount}</td>
                      <td className="py-2 px-3">{row.dietCount}</td>
                      <td className="py-2 px-3">
                        {formatDateTime(row.lastUpdated)}
                      </td>
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
