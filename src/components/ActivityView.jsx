import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

const BASE_COLUMNS = ["userId", "actions", "lastUpdated", "createdAt"];

const COLUMN_LABELS = {
  userId: "User",
  actions: "Activity",
  lastUpdated: "Last Updated",
  createdAt: "Created At",
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

  // Only show the columns we care about, and only if they exist in at least one doc
  const columnKeys =
    docs.length > 0
      ? BASE_COLUMNS.filter((key) =>
          docs.some((doc) => Object.prototype.hasOwnProperty.call(doc, key))
        )
      : [];

  const formatCell = (key, value) => {
    if (value == null || value === "") return "-";

    // Date-like fields
    if (["createdAt", "updatedAt", "lastUpdated"].includes(key)) {
      const d = new Date(value);
      if (!isNaN(d)) return d.toLocaleString();
    }

    // Activities JSON blob – show something human friendly
    if (key === "actions") {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;

        // Adjust this block based on your real structure
        if (parsed.Contest) {
          const c = parsed.Contest;
          const parts = [];
          if (c.activity) parts.push(c.activity);
          if (c.status) parts.push(c.status);
          if (c.lastActivityTime) {
            const d = new Date(c.lastActivityTime);
            if (!isNaN(d)) parts.push(d.toLocaleString());
          }
          return parts.length ? parts.join(" • ") : "Contest activity";
        }

        const str = JSON.stringify(parsed);
        return str.length > 80 ? str.slice(0, 77) + "…" : str;
      } catch {
        const str = String(value);
        return str.length > 80 ? str.slice(0, 77) + "…" : str;
      }
    }

    // Arrays – show counts instead of raw JSON
    if (Array.isArray(value)) {
      return value.length ? `${value.length} item(s)` : "-";
    }

    // Generic object
    if (typeof value === "object") {
      return "[data]";
    }

    const str = String(value);
    return str.length > 60 ? str.slice(0, 57) + "…" : str;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Activity Overview</h1>
        <p className="text-muted-foreground text-sm">
          Live view of recent user activities from the <code>activities</code>{" "}
          collection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Total records in <code>activities</code>:{" "}
            <span className="font-semibold">{data.total}</span>
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
          ) : docs.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No activity records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    {columnKeys.map((key) => (
                      <th key={key} className="text-left py-2 px-3">
                        {COLUMN_LABELS[key] || key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, idx) => (
                    <tr
                      key={doc._id || idx}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-2 px-3 text-muted-foreground">
                        {idx + 1}
                      </td>
                      {columnKeys.map((key) => (
                        <td key={key} className="py-2 px-3">
                          {formatCell(key, doc[key])}
                        </td>
                      ))}
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
