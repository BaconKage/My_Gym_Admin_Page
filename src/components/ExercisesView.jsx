import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

const LEVEL_LABELS = ["Beginner", "Intermediate", "Advanced"];

// Helper: does this exercise have any meaningful info?
const hasDetails = (doc) => {
  return (
    doc?.name ||
    doc?.levels ||
    doc?.sub_categories_Name ||
    doc?.video ||
    doc?.description
  );
};

function ExercisesView() {
  const [data, setData] = useState({ docs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        // Load first 100 records for the admin view
        const res = await fetchCollectionData("exercises", 1, 100);
        setData(res);
      } catch (err) {
        console.error("Failed to load exercises", err);
        setError("Failed to load exercises from MongoDB.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Raw documents from backend
  const rawDocs = data.docs || [];

  // Only keep exercises that have at least one meaningful field
  const docs = rawDocs.filter(hasDetails);

  // ---- derive some simple stats on the cleaned list ----
  const levelCounts = docs.reduce(
    (acc, doc) => {
      const levelRaw = (doc.levels || "").toString().trim();
      const level =
        LEVEL_LABELS.find(
          (label) => label.toLowerCase() === levelRaw.toLowerCase()
        ) || "Other";

      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    { Beginner: 0, Intermediate: 0, Advanced: 0, Other: 0 }
  );

  // ---- filtering & search ----
  const filteredDocs = docs.filter((doc) => {
    const name = (doc.name || "").toString().toLowerCase();
    const level = (doc.levels || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch = !term || name.includes(term);
    const matchesLevel =
      levelFilter === "all" ||
      level === levelFilter.toLowerCase() ||
      (levelFilter === "other" &&
        !["beginner", "intermediate", "advanced"].includes(level));

    return matchesSearch && matchesLevel;
  });

  const formatDescription = (value) => {
    if (!value) return "-";
    const str = String(value);
    return str.length > 80 ? str.slice(0, 77) + "…" : str;
  };

  const renderVideoCell = (value) => {
    if (!value) return "-";
    const url = String(value);
    const isUrl = url.startsWith("http://") || url.startsWith("https://");
    if (!isUrl) return url;

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center px-2 py-1 text-[11px] rounded border border-slate-600/60 hover:border-slate-300/80 hover:bg-slate-700/40 transition-colors"
      >
        Open video
      </a>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <p className="text-muted-foreground text-sm">
          Library of all exercises available inside MyGym. Use the filters below
          to quickly find and verify exercises.
        </p>
      </div>

      {/* Summary + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Summary</CardTitle>
            <CardDescription className="text-xs">
              Total exercises in <code>exercises</code> collection:{" "}
              <span className="font-semibold">{data.total}</span>
              <br />
              Showing{" "}
              <span className="font-semibold">{docs.length}</span> with
              configured details (empty records are hidden).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
              <p className="text-[11px] text-muted-foreground mb-1">
                Beginner
              </p>
              <p className="text-base font-semibold">
                {levelCounts.Beginner || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
              <p className="text-[11px] text-muted-foreground mb-1">
                Intermediate
              </p>
              <p className="text-base font-semibold">
                {levelCounts.Intermediate || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
              <p className="text-[11px] text-muted-foreground mb-1">
                Advanced
              </p>
              <p className="text-base font-semibold">
                {levelCounts.Advanced || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
              <p className="text-[11px] text-muted-foreground mb-1">Other</p>
              <p className="text-base font-semibold">
                {levelCounts.Other || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filters</CardTitle>
            <CardDescription className="text-xs">
              Narrow down the list by exercise name or difficulty level.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block text-[11px] text-muted-foreground">
                Search by name
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Push up, Squat…"
                className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-muted-foreground">
                Filter by level
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="other">Other / unspecified</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Exercises list</CardTitle>
          <CardDescription className="text-xs">
            Showing {filteredDocs.length} of {docs.length} detailed exercises.
            Click the video button to preview the form on YouTube.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading exercises…
            </div>
          ) : error ? (
            <div className="py-4 text-sm text-red-200 bg-red-500/10 border border-red-500/40 rounded-lg">
              {error}
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No exercises match the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Exercise name</th>
                    <th className="text-left py-2 px-3">Level</th>
                    <th className="text-left py-2 px-3">Muscle group</th>
                    <th className="text-left py-2 px-3">Video</th>
                    <th className="text-left py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, idx) => (
                    <tr
                      key={doc._id || idx}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-2 px-3 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-medium">
                        {doc.name || "-"}
                      </td>
                      <td className="py-2 px-3">
                        {doc.levels || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {doc.sub_categories_Name || "-"}
                      </td>
                      <td className="py-2 px-3">
                        {renderVideoCell(doc.video)}
                      </td>
                      <td className="py-2 px-3">
                        {formatDescription(doc.description)}
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

export default ExercisesView;
