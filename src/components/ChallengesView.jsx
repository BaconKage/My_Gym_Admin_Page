import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

// Helper: pick the first non-empty value from a list of candidate keys
const pickField = (doc, keys, fallback = null) => {
  for (const key of keys) {
    const v = doc?.[key];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
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

const getStatusInfo = (doc) => {
  // Try common flags: status string OR completed boolean
  const statusRaw = (
    pickField(doc, ["status", "state", "challengeStatus"]) || ""
  )
    .toString()
    .toLowerCase();
  const completedFlag = !!pickField(doc, ["completed", "isCompleted"], false);

  let label = "In progress";
  let variant = "amber";

  if (completedFlag || ["completed", "finished", "done"].includes(statusRaw)) {
    label = "Completed";
    variant = "emerald";
  } else if (["pending", "not_started"].includes(statusRaw)) {
    label = "Pending";
    variant = "slate";
  } else if (["cancelled", "canceled", "failed"].includes(statusRaw)) {
    label = "Cancelled";
    variant = "rose";
  }

  return { label, variant };
};

const getProgressText = (doc) => {
  const pct = pickField(doc, ["progress", "progressPercent", "percentage"]);
  const stepsDone = pickField(doc, ["steps_done", "currentSteps", "completedSteps"]);
  const stepsGoal = pickField(doc, ["steps_goal", "goalSteps", "targetSteps"]);

  if (pct != null && pct !== "") {
    const n = Number(pct);
    if (!Number.isNaN(n)) return `${n}%`;
  }

  if (stepsDone != null && stepsGoal != null) {
    return `${stepsDone}/${stepsGoal} steps`;
  }

  if (stepsDone != null) {
    return `${stepsDone} steps`;
  }

  return "-";
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
        // Use challengesworks as the main source
        const res = await fetchCollectionData("challengesworks", 1, 50);
        setData(res);
      } catch (err) {
        console.error("Failed to load challenges", err);
        setError("Failed to load challenge participation data from MongoDB.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const docs = (data.docs || []).filter((doc) => doc && Object.keys(doc).length);

  // --- derive summary stats ---
  const summary = docs.reduce(
    (acc, doc) => {
      const challengeId = pickField(doc, ["challenge_id", "challengeId", "challenge"]);
      if (challengeId) acc.challengeIds.add(String(challengeId));

      const { label } = getStatusInfo(doc);
      if (label === "Completed") acc.completed += 1;
      else if (label === "Pending") acc.pending += 1;
      else if (label === "Cancelled") acc.cancelled += 1;
      else acc.inProgress += 1;

      return acc;
    },
    {
      challengeIds: new Set(),
      completed: 0,
      inProgress: 0,
      pending: 0,
      cancelled: 0,
    }
  );

  const uniqueChallenges = summary.challengeIds.size;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-muted-foreground text-sm">
          Participation and progress records from the{" "}
          <code>challengesworks</code> collection. Each row shows how a user is
          doing inside a particular challenge.
        </p>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Total records in <code>challengesworks</code>:{" "}
            <span className="font-semibold">{data.total}</span>
            <br />
            Showing the most recent{" "}
            <span className="font-semibold">{docs.length}</span> entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-3 py-2">
            <p className="text-[11px] text-muted-foreground mb-1">
              Unique challenges
            </p>
            <p className="text-base font-semibold">{uniqueChallenges}</p>
          </div>
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/40 px-3 py-2">
            <p className="text-[11px] text-emerald-100 mb-1">Completed</p>
            <p className="text-base font-semibold text-emerald-200">
              {summary.completed}
            </p>
          </div>
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/40 px-3 py-2">
            <p className="text-[11px] text-amber-100 mb-1">In progress</p>
            <p className="text-base font-semibold text-amber-200">
              {summary.inProgress}
            </p>
          </div>
          <div className="rounded-lg bg-slate-700/40 border border-slate-500/60 px-3 py-2">
            <p className="text-[11px] text-slate-200 mb-1">
              Pending / Cancelled
            </p>
            <p className="text-base font-semibold text-slate-50">
              {summary.pending + summary.cancelled}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Challenge participation (recent)
          </CardTitle>
          <CardDescription className="text-xs">
            Who is participating in which challenge, how far they&apos;ve
            progressed, and when their record was last updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading challenges…
            </div>
          ) : error ? (
            <div className="py-4 text-sm text-red-200 bg-red-500/10 border border-red-500/40 rounded-lg">
              {error}
            </div>
          ) : docs.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No challenge records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Challenge</th>
                    <th className="text-left py-2 px-3">Participant</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Progress</th>
                    <th className="text-left py-2 px-3">Start</th>
                    <th className="text-left py-2 px-3">Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, idx) => {
                    const challengeName =
                      pickField(doc, ["challenge_name", "challengeName", "name"]) ||
                      pickField(doc, ["challenge_id", "challengeId", "challenge"]);
                    const userId =
                      pickField(doc, ["user_id", "userid", "member_id"]) ||
                      pickField(doc, ["created_for", "assigned_to"]);
                    const { label, variant } = getStatusInfo(doc);
                    const progressText = getProgressText(doc);
                    const startDate =
                      pickField(doc, ["start_at", "startDate", "created_at"]) ||
                      null;
                    const lastUpdated =
                      pickField(doc, ["lastUpdated", "updated_at"]) || null;

                    const badgeClass =
                      variant === "emerald"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                        : variant === "amber"
                        ? "bg-amber-500/10 text-amber-200 border-amber-500/40"
                        : variant === "rose"
                        ? "bg-rose-500/10 text-rose-200 border-rose-500/40"
                        : "bg-slate-500/10 text-slate-200 border-slate-500/40";

                    return (
                      <tr
                        key={doc._id || idx}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="py-2 px-3 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-medium">
                          {challengeName || "-"}
                        </td>
                        <td className="py-2 px-3">
                          {userId || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${badgeClass}`}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="py-2 px-3">{progressText}</td>
                        <td className="py-2 px-3">
                          {formatDate(startDate)}
                        </td>
                        <td className="py-2 px-3">
                          {formatDateTime(lastUpdated)}
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

export default ChallengesView;
