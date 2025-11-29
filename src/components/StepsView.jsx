import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

// Try to compute a sensible total steps value from the stepData array
const computeTotalSteps = (stepData) => {
  if (!Array.isArray(stepData) || stepData.length === 0) return null;

  let total = 0;
  stepData.forEach((entry) => {
    if (typeof entry === "number") {
      total += entry;
    } else if (entry && typeof entry === "object") {
      if (typeof entry.steps === "number") {
        total += entry.steps;
      } else if (typeof entry.totalSteps === "number") {
        total += entry.totalSteps;
      }
    }
  });

  return total || null;
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function StepsView() {
  const [data, setData] = useState({ docs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        // Fetch up to 50 most recent daily step records
        const res = await fetchCollectionData("dailysteps", 1, 50);
        setData(res);
      } catch (err) {
        console.error("Failed to load daily steps", err);
        setError("Failed to load daily steps from MongoDB.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const docs = data.docs || [];

  // Derive some simple summary stats
  const summary = docs.reduce(
    (acc, doc) => {
      const totalSteps = computeTotalSteps(doc.stepData);
      acc.totalRecords += 1;
      if (doc.completed) acc.completed += 1;
      else acc.pending += 1;

      if (typeof totalSteps === "number") {
        acc.totalSteps += totalSteps;
        acc.withSteps += 1;
      }
      return acc;
    },
    { totalRecords: 0, completed: 0, pending: 0, totalSteps: 0, withSteps: 0 }
  );

  const avgSteps =
    summary.withSteps > 0
      ? Math.round(summary.totalSteps / summary.withSteps)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Daily Steps</h1>
        <p className="text-muted-foreground text-sm">
          Live view of recent step records from the <code>dailysteps</code>{" "}
          collection. Each row represents one day&apos;s goal and progress for a
          user.
        </p>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Total records in <code>dailysteps</code>:{" "}
            <span className="font-semibold">{data.total}</span>
            <br />
            Showing the most recent{" "}
            <span className="font-semibold">{docs.length}</span> records.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Completed days
            </p>
            <p className="text-base font-semibold">{summary.completed}</p>
          </div>
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Pending days
            </p>
            <p className="text-base font-semibold">{summary.pending}</p>
          </div>
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Avg. steps (where data available)
            </p>
            <p className="text-base font-semibold">
              {summary.withSteps > 0 ? avgSteps.toLocaleString() : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Table with shaped data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent step records</CardTitle>
          <CardDescription className="text-xs">
            One row per day per user. Goal steps and total steps are calculated
            from the record and its stepData array.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading daily steps…
            </div>
          ) : error ? (
            <div className="py-4 text-sm text-red-200 bg-red-500/10 border border-red-500/40 rounded-lg">
              {error}
            </div>
          ) : docs.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No daily step records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Goal steps</th>
                    <th className="text-left py-2 px-3">Total steps</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">User ID</th>
                    <th className="text-left py-2 px-3">Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, idx) => {
                    const totalSteps = computeTotalSteps(doc.stepData);
                    const isCompleted = !!doc.completed;

                    return (
                      <tr
                        key={doc._id || idx}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="py-2 px-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3">
                          {formatDate(doc.for_date)}
                        </td>
                        <td className="py-2 px-3">
                          {doc.goalSteps != null
                            ? Number(doc.goalSteps).toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-2 px-3">
                          {typeof totalSteps === "number"
                            ? totalSteps.toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                                : "bg-amber-500/10 text-amber-200 border border-amber-500/40"
                            }`}
                          >
                            {isCompleted ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {doc.created_for || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {formatDateTime(doc.lastUpdated || doc.updated_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StepsView;
