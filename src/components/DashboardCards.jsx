import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Activity,
  TrendingUp,
  Trophy,
  Dumbbell,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import { fetchCollectionsMeta, fetchCollectionData } from "../api";

const IMPORTANT_COLLECTIONS = [
  "activities",
  "activityfeeds",
  "attendances",
  "auditlogs",
  "audittrails",
  "blogs",
  "bmrs",
  "carts",
  "certifications",
  "challenges",
  "challengesworks",
  "chatmembers",
  "commonpages",
  "conversations",
  "createmembershiptokens",
  "dailysteps",
  "exercisecategories",
  "exerciselevels",
  "exercises",
  "exercisesubcategories",
];

// Human-friendly collection labels for the sidebar
const COLLECTION_LABELS = {
  activities: "User Activities",
  activityfeeds: "Activity Feed",
  attendances: "Trainer Attendance",
  auditlogs: "Audit Logs",
  audittrails: "Audit Trails",
  blogs: "Blogs",
  bmrs: "BMR Records",
  carts: "Shopping Carts",
  certifications: "Certifications",
  challenges: "Challenges",
  challengesworks: "Challenge Workouts",
  chatmembers: "Chat Members",
  commonpages: "Static Pages",
  conversations: "Conversations",
  createmembershiptokens: "Membership Tokens",
  dailysteps: "Daily Steps",
  exercisecategories: "Exercise Categories",
  exerciselevels: "Exercise Levels",
  exercises: "Exercises Library",
  exercisesubcategories: "Exercise Sub-categories",
};

// Which columns to show for each important collection
const COLLECTION_COLUMN_CONFIG = {
  activities: ["userId", "actions", "lastUpdated", "createdAt"],
  dailysteps: ["userId", "today_steps", "date"],
  exercises: ["name", "description", "levels", "sub_categories_Name", "video"],
  challenges: ["name", "description", "start_at", "end_at", "entry_fees"],
  carts: ["userId", "status", "total_amount", "updatedAt"],
  conversations: ["members", "lastMessage", "updatedAt"],
  // add more per collection as needed
};

function DashboardCards({ onCardClick, stats, statsLoading, statsError }) {
  // ---- dashboard stats (already wired to backend) ----
  if (statsLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading dashboard stats…</p>
        </div>
      </div>
    );
  }

  if (statsError && !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-sm text-red-200">
          {statsError}
        </div>
      </div>
    );
  }

  const safeStats = stats || {
    totalActivities: 0,
    totalDailyStepsRecords: 0,
    totalExercises: 0,
    activeChallenges: 0,
    openCarts: 0,
    totalConversations: 0,
  };

  const cards = [
    {
      id: "activity",
      title: "Total Activities",
      value: safeStats.totalActivities.toLocaleString(),
      description: "From activities collection",
      icon: Activity,
      color: "text-blue-500",
      gradient: "from-blue-500/10 to-blue-600/10",
    },
    {
      id: "steps",
      title: "Daily Steps Records",
      value: safeStats.totalDailyStepsRecords.toLocaleString(),
      description: "From dailysteps collection",
      icon: TrendingUp,
      color: "text-green-500",
      gradient: "from-green-500/10 to-green-600/10",
    },
    {
      id: "challenges",
      title: "Active Challenges",
      value: safeStats.activeChallenges.toLocaleString(),
      description: "From challenges collection",
      icon: Trophy,
      color: "text-yellow-500",
      gradient: "from-yellow-500/10 to-yellow-600/10",
    },
    {
      id: "workouts",
      title: "Total Exercises",
      value: safeStats.totalExercises.toLocaleString(),
      description: "From exercises collection",
      icon: Dumbbell,
      color: "text-purple-500",
      gradient: "from-purple-500/10 to-purple-600/10",
    },
    {
      id: "carts",
      title: "Open Carts",
      value: safeStats.openCarts.toLocaleString(),
      description: "From carts collection",
      icon: ShoppingCart,
      color: "text-orange-500",
      gradient: "from-orange-500/10 to-orange-600/10",
    },
    {
      id: "conversations",
      title: "Conversations",
      value: safeStats.totalConversations.toLocaleString(),
      description: "From conversations collection",
      icon: MessageSquare,
      color: "text-pink-500",
      gradient: "from-pink-500/10 to-pink-600/10",
    },
  ];

  // ---- collections meta + data explorer ----
  const [collectionsMeta, setCollectionsMeta] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState("");

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedData, setSelectedData] = useState({
    docs: [],
    total: 0,
    page: 1,
    limit: 20,
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  // load meta (counts per collection)
  useEffect(() => {
    async function loadMeta() {
      try {
        setCollectionsLoading(true);
        setCollectionsError("");
        const meta = await fetchCollectionsMeta();
        const filtered = meta.filter((m) =>
          IMPORTANT_COLLECTIONS.includes(m.name)
        );
        setCollectionsMeta(filtered);

        // default selection
        if (!selectedCollection && filtered.length) {
          setSelectedCollection(filtered[0].name);
        }
      } catch (err) {
        console.error("Failed to load collection meta", err);
        setCollectionsError("Failed to load collection statistics.");
      } finally {
        setCollectionsLoading(false);
      }
    }

    loadMeta();
  }, []); // run once

  // load docs for selected collection
  useEffect(() => {
    if (!selectedCollection) return;
    async function loadDocs() {
      try {
        setDataLoading(true);
        setDataError("");
        const data = await fetchCollectionData(selectedCollection, 1, 20);
        setSelectedData(data);
      } catch (err) {
        console.error("Failed to load collection docs", err);
        setDataError(
          `Failed to load documents for collection "${selectedCollection}".`
        );
      } finally {
        setDataLoading(false);
      }
    }
    loadDocs();
  }, [selectedCollection]);

  const docs = selectedData.docs || [];

  const columnKeys =
    docs.length > 0
      ? (() => {
          const configured = COLLECTION_COLUMN_CONFIG[selectedCollection] || null;

          if (configured) {
            // Only include keys that actually exist in at least one doc
            return configured.filter((key) =>
              docs.some((doc) =>
                Object.prototype.hasOwnProperty.call(doc, key)
              )
            );
          }

          // Fallback: generic auto-detected keys (old behaviour)
          return Array.from(
            new Set(
              docs.flatMap((doc) =>
                Object.keys(doc).filter(
                  (k) => k !== "_id" && !k.startsWith("__")
                )
              )
            )
          ).slice(0, 6);
        })()
      : [];

  const formatCell = (key, value) => {
    if (value == null || value === "") return "-";

    // Date-like fields
    if (
      [
        "createdAt",
        "updatedAt",
        "lastUpdated",
        "start_at",
        "end_at",
        "date",
      ].includes(key)
    ) {
      const d = new Date(value);
      if (!isNaN(d)) return d.toLocaleString();
    }

    // Money / entry fees
    if (key === "entry_fees") {
      const num = Number(value);
      if (!num) return "Free";
      return `₹ ${num.toLocaleString()}`;
    }

    // Activities JSON blob – show something human friendly
    if (key === "actions") {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;

        if (parsed.Contest) {
          const c = parsed.Contest;
          const parts = [];
          if (c.activity) parts.push(c.activity);
          if (c.status) parts.push(c.status);
          if (c.lastActivityTime) {
            const d = new Date(c.lastActivityTime);
            if (!isNaN(d)) parts.push(d.toLocaleString());
          }
          return parts.join(" • ") || "Contest activity";
        }

        const str = JSON.stringify(parsed);
        return str.length > 80 ? str.slice(0, 77) + "..." : str;
      } catch {
        const str = String(value);
        return str.length > 80 ? str.slice(0, 77) + "..." : str;
      }
    }

    // Arrays – show counts instead of raw JSON
    if (Array.isArray(value)) {
      if (key === "members") {
        return `${value.length} member${value.length === 1 ? "" : "s"}`;
      }
      return value.length ? `${value.length} item(s)` : "-";
    }

    // Generic object
    if (typeof value === "object") {
      return "[data]";
    }

    const str = String(value);
    return str.length > 60 ? str.slice(0, 57) + "..." : str;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h2 className="text-4xl font-bold page-header mb-2">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Live data from your MyGym MongoDB. Click on any card to view detailed
          information.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="stat-card card-hover-effect cursor-pointer group"
              onClick={() => onCardClick(card.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="stat-number text-3xl font-bold mb-1">
                  {card.value}
                </div>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Collections overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Collections overview</h3>
          <p className="text-xs text-muted-foreground">
            Showing key collections from the <code>my_gym</code> database. Click
            a row to preview records.
          </p>
        </div>

        {collectionsError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-sm text-red-200">
            {collectionsError}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: list of collections + counts */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm">Collections & counts</CardTitle>
              <CardDescription className="text-xs">
                Basic statistics for each important collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {collectionsLoading ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading collection statistics…
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-xs text-muted-foreground">
                        <th className="text-left py-2 px-4">Collection</th>
                        <th className="text-right py-2 px-4">Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionsMeta.map((c) => (
                        <tr
                          key={c.name}
                          className={`border-b border-border/40 last:border-0 cursor-pointer hover:bg-accent/40 ${
                            selectedCollection === c.name
                              ? "bg-accent/60"
                              : "bg-background"
                          }`}
                          onClick={() => setSelectedCollection(c.name)}
                        >
                          <td className="py-2 px-4 font-medium">
                            {COLLECTION_LABELS[c.name] || c.name}
                          </td>
                          <td className="py-2 px-4 text-right">
                            {c.count.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {collectionsMeta.length === 0 && !collectionsLoading && (
                        <tr>
                          <td
                            colSpan={2}
                            className="py-3 px-4 text-sm text-muted-foreground"
                          >
                            No collection statistics found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: preview of selected collection */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm">
                {selectedCollection
                  ? `Preview: ${
                      COLLECTION_LABELS[selectedCollection] ||
                      selectedCollection
                    }`
                  : "Preview"}
              </CardTitle>
              <CardDescription className="text-xs">
                Showing up to {selectedData.limit} recent records from this
                module. Values are read-only and meant to give admins a quick
                overview.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {dataLoading ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading documents…
                </div>
              ) : dataError ? (
                <div className="p-4 text-sm text-red-200 bg-red-500/10 border-t border-red-500/40">
                  {dataError}
                </div>
              ) : !docs.length ? (
                <div className="p-4 text-sm text-muted-foreground">
                  No documents found for this collection.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                        <th className="text-left py-2 px-3">#</th>
                        {columnKeys.map((key) => (
                          <th key={key} className="text-left py-2 px-3">
                            {key}
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
      </div>
    </div>
  );
}

export default DashboardCards;
