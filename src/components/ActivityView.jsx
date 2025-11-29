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

// Safely normalise Mongo-style IDs: "abc", { $oid: "abc" }, or {_id: "..."}
function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return value.$oid;
    if (value._id) return normalizeId(value._id);
  }
  return String(value);
}

function formatDate(value) {
  if (!value && value !== 0) return "-";

  let date;
  if (typeof value === "number") {
    date = new Date(value);
  } else if (typeof value === "object" && value.$date) {
    date = new Date(value.$date);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildActivitySummary(actions = {}) {
  const parts = [];

  Object.entries(actions).forEach(([key, obj]) => {
    const count = obj?.count ?? 0;
    if (count > 0) {
      parts.push(`${key}: ${count}`);
    }
  });

  return parts.length ? parts.join(" • ") : "No activity yet";
}

function ActivityView() {
  const [activityData, setActivityData] = useState({ docs: [], total: 0 });
  const [usersById, setUsersById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        // Load activities + users in parallel
        const [activitiesRes, usersRes] = await Promise.all([
          fetchCollectionData("activities", 1, 100),
          fetchCollectionData("users", 1, 500),
        ]);

        setActivityData(activitiesRes || { docs: [], total: 0 });

        // Build quick lookup map: userId -> user
        const userDocs = (usersRes && usersRes.docs) || [];
        const map = {};
        userDocs.forEach((u) => {
          const id = normalizeId(u._id);
          if (id) map[id] = u;
        });
        setUsersById(map);
      } catch (err) {
        console.error("Failed to load activities/users", err);
        setError("Failed to load activities from MongoDB.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const docs = activityData.docs || [];

  const rows = docs.map((doc, idx) => {
    const userId =
      normalizeId(doc.userId) ||
      normalizeId(doc.user) ||
      normalizeId(doc.created_for);

    const user = usersById[userId];
    const userName = user?.name || user?.username || user?.email || "Unknown";

    return {
      index: idx + 1,
      userId,
      userName,
      activity: buildActivitySummary(doc.actions),
      lastUpdated: formatDate(doc.lastUpdated),
      createdAt: formatDate(doc.created_at),
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Activity Overview</h1>
        <p className="text-muted-foreground text-sm">
          Live view of recent user activities from the{" "}
          <code>activities</code> collection.
        </p>
      </div>

      {/* Summary + table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Total records in <code>activities</code>:{" "}
            <span className="font-semibold">{activityData.total}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading activity data…
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
                    <th className="text-left py-2 px-3">User</th>
                    <th className="text-left py-2 px-3">Activity</th>
                    <th className="text-left py-2 px-3">Last Updated</th>
                    <th className="text-left py-2 px-3">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={`${row.userId}-${row.index}`}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-2 px-3 text-muted-foreground">
                        {row.index}
                      </td>

                      {/* User name + ID */}
                      <td className="py-2 px-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {row.userName}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {row.userId || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="py-2 px-3">{row.activity}</td>
                      <td className="py-2 px-3">{row.lastUpdated}</td>
                      <td className="py-2 px-3">{row.createdAt}</td>
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
