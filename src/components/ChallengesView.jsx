import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

const normalizeId = (value) => {
  if (!value) return null;
  if (value.$oid) return value.$oid;
  if (value._id) return value._id;
  return String(value);
};

const normalizeCreatedAt = (value) => {
  if (!value) return null;

  // { $numberLong: "1734359170832" }
  if (typeof value === "object" && value.$numberLong) {
    const ms = parseInt(value.$numberLong, 10);
    if (!Number.isNaN(ms)) return new Date(ms);
  }

  // plain number (ms)
  if (typeof value === "number") {
    return new Date(value);
  }

  // ISO string or other date-like string
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }

  return null;
};

const formatDateTime = (value) => {
  const d = normalizeCreatedAt(value);
  if (!d || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortText = (text, max = 80) => {
  if (!text) return "-";
  const str = String(text);
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "...";
};

function ChallengesView() {
  const [data, setData] = useState({ docs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        // ✅ use challengesworks as the source collection
        const res = await fetchCollectionData("challengesworks", 1, 50);
        setData(res);
      } catch (err) {
        console.error("Failed to load challengesworks", err);
        setError("Failed to load challenge entries from MongoDB.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const docs = (data.docs || []).filter((d) => d && Object.keys(d).length);

  // Build nice rows based on your schema
  const rows = docs.map((doc) => {
    const challengeId = normalizeId(doc.challenge);
    const userId = normalizeId(doc.user);
    const createdAt = doc.created_at;
    const deletedAt = doc.deleted_at;
    const description = doc.description;
    const image = doc.image;
    const video = doc.video;

    return {
      id:
        normalizeId(doc._id) ||
        `${challengeId || "challenge"}-${userId || "user"}`,
      challengeId,
      userId,
      description,
      image,
      video,
      createdAt,
      deletedAt,
    };
  });

  // Summary stats
  const summary = rows.reduce(
    (acc, row) => {
      if (row.challengeId) acc.challengeIds.add(row.challengeId);
      if (row.userId) acc.userIds.add(row.userId);
      if (row.deletedAt) acc.deletedCount += 1;
      return acc;
    },
    {
      challengeIds: new Set(),
      userIds: new Set(),
      deletedCount: 0,
    }
  );

  const totalRecords = data.total;
  const uniqueChallenges = summary.challengeIds.size;
  const uniqueParticipants = summary.userIds.size;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-muted-foreground text-sm">
          Each row represents a{" "}
          <span className="font-semibold">user&apos;s entry</span> in a
          challenge from the <code>challengesworks</code> collection. Admins
          can quickly see who joined which challenge, when it was created, and
          whether an image or video was uploaded.
        </p>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Total records in <code>challengesworks</code>:{" "}
            <span className="font-semibold">{totalRecords}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Entries loaded (recent)
            </p>
            <p className="text-base font-semibold">{rows.length}</p>
          </div>
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/40 px-3 py-2">
            <p className="text-[11px] text-blue-100 mb-1">
              Unique challenges
            </p>
            <p className="text-base font-semibold text-blue-200">
              {uniqueChallenges}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/40 px-3 py-2">
            <p className="text-[11px] text-emerald-100 mb-1">
              Unique participants
            </p>
            <p className="text-base font-semibold text-emerald-200">
              {uniqueParticipants}
            </p>
          </div>
          <div className="rounded-lg bg-rose-500/5 border border-rose-500/40 px-3 py-2">
            <p className="text-[11px] text-rose-100 mb-1">Deleted entries</p>
            <p className="text-base font-semibold text-rose-200">
              {summary.deletedCount}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Challenge entries</CardTitle>
          <CardDescription className="text-xs">
            Description and media come directly from{" "}
            <code>description</code>, <code>image</code>, and{" "}
            <code>video</code> fields in MongoDB. Use these IDs if you need to
            cross-check in the main <code>challenges</code> or{" "}
            <code>users</code> collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading challenge entries…
            </div>
          ) : error ? (
            <div className="py-4 text-sm text-red-200 bg-red-500/10 border border-red-500/40 rounded-lg">
              {error}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No entries found in <code>challengesworks</code> yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">User ID</th>
                    <th className="text-left py-2 px-3">Challenge ID</th>
                    <th className="text-left py-2 px-3">Description</th>
                    <th className="text-left py-2 px-3">Image</th>
                    <th className="text-left py-2 px-3">Video</th>
                    <th className="text-left py-2 px-3">Created at</th>
                    <th className="text-left py-2 px-3">Deleted?</th>
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
                        {row.userId || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px]">
                        {row.challengeId || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {formatShortText(row.description, 80)}
                      </td>
                      <td className="py-2 px-3">
                        {row.image ? (
                          <a
                            href={row.image}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-slate-800/60 border border-slate-600 px-2 py-0.5 text-[11px] hover:bg-slate-700"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {row.video ? (
                          <a
                            href={row.video}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-slate-800/60 border border-slate-600 px-2 py-0.5 text-[11px] hover:bg-slate-700"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {formatDateTime(row.createdAt)}
                      </td>
                      <td className="py-2 px-3">
                        {row.deletedAt ? (
                          <span className="inline-flex rounded-full bg-rose-500/10 border border-rose-500/40 px-2 py-0.5 text-[11px] text-rose-200">
                            Deleted
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-200">
                            Active
                          </span>
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

export default ChallengesView;
