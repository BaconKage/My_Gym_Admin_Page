import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

const normalizeDate = (value) => {
  if (!value) return null;
  if (value.$date) return new Date(value.$date);
  if (typeof value === "string" || value instanceof Date) return new Date(value);
  return null;
};

const formatDateTime = (value) => {
  const d = normalizeDate(value);
  if (!d || isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const shorten = (str, max = 80) => {
  if (!str) return "-";
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "...";
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
        // activities collection
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

  // Flatten each document (one per user) into user-action rows
  const rows = docs.flatMap((doc) => {
    const userId =
      doc.userId?._id ||
      doc.userId?.$oid ||
      doc.userId ||
      doc.userid ||
      doc.user_id;

    const actions = doc.actions || {};
    return Object.entries(actions).map(([actionType, info]) => {
      const count = info?.count ?? 0;
      const lastActivityTime = info?.lastActivityTime;
      const notes = Array.isArray(info?.notes) ? info.notes : [];
      const latestNote = notes[notes.length - 1] || null;
      const ref =
        info?.ref?._id || info?.ref?.$oid || info?.ref || null;
      const refType = info?.refType || null;

      return {
        userId,
        actionType,
        count,
        lastActivityTime,
        latestNote,
        ref,
        refType,
        docId: doc._id?._id || doc._id?.$oid || doc._id,
      };
    });
  });

  // Summary stats
  const summary = rows.reduce(
    (acc, row) => {
      if (row.userId) acc.userIds.add(String(row.userId));
      acc.totalEvents += Number(row.count) || 0;
      acc.actionTypes.add(row.actionType);
      return acc;
    },
    {
      userIds: new Set(),
      totalEvents: 0,
      actionTypes: new Set(),
    }
  );

  const totalUsersWithActivity = summary.userIds.size;
  const totalActionTypes = summary.actionTypes.size;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Activity Overview</h1>
        <p className="text-muted-foreground text-sm">
          Per-user activity summary from the <code>activities</code>{" "}
          collection. Each row below shows one type of action (Login,
          WorkoutPlan, Contest, etc.) for a specific user.
        </p>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Raw documents in <code>activities</code>:{" "}
            <span className="font-semibold">{data.total}</span>
            <br />
            Flattened view below combines user &amp; action type into readable
            rows for admins.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Users with activity
            </p>
            <p className="text-base font-semibold">
              {totalUsersWithActivity}
            </p>
          </div>
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/30 px-3 py-2">
            <p className="text-[11px] text-blue-100 mb-1">Total events</p>
            <p className="text-base font-semibold text-blue-200">
              {summary.totalEvents.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-violet-500/5 border border-violet-500/30 px-3 py-2">
            <p className="text-[11px] text-violet-100 mb-1">
              Different action types
            </p>
            <p className="text-base font-semibold text-violet-200">
              {totalActionTypes}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">User activity breakdown</CardTitle>
          <CardDescription className="text-xs">
            One row per user per action type. Counts come from the{" "}
            <code>actions.&lt;Type&gt;.count</code> field. The latest note is
            taken from the action&apos;s notes array.
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
              No activity records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">User</th>
                    <th className="text-left py-2 px-3">Action type</th>
                    <th className="text-left py-2 px-3">Count</th>
                    <th className="text-left py-2 px-3">Last activity</th>
                    <th className="text-left py-2 px-3">Latest note</th>
                    <th className="text-left py-2 px-3">Ref / Type</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={`${row.docId || "doc"}-${row.actionType}-${idx}`}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-2 px-3 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3">
                        {row.userId || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-medium">
                        {row.actionType}
                      </td>
                      <td className="py-2 px-3">
                        {row.count != null ? row.count : "-"}
                      </td>
                      <td className="py-2 px-3">
                        {formatDateTime(row.lastActivityTime)}
                      </td>
                      <td className="py-2 px-3">
                        {shorten(row.latestNote, 80)}
                      </td>
                      <td className="py-2 px-3">
                        {row.ref || row.refType ? (
                          <span className="text-[11px]">
                            {row.ref && (
                              <span className="text-muted-foreground">
                                {row.ref}
                              </span>
                            )}
                            {row.ref && row.refType && " · "}
                            {row.refType && (
                              <span className="uppercase tracking-wide">
                                {row.refType}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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
