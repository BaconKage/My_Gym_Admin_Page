import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { fetchCollectionData } from "../api";

function ExercisesView() {
  const [data, setData] = useState({ docs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetchCollectionData("exercises", 1, 50);
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

  const docs = data.docs || [];
  const columnKeys =
    docs.length > 0
      ? Array.from(
          new Set(
            docs.flatMap((doc) =>
              Object.keys(doc).filter(
                (k) => k !== "_id" && !k.startsWith("__")
              )
            )
          )
        ).slice(0, 6)
      : [];

  const formatCell = (value) => {
    if (value == null) return "-";
    if (typeof value === "object") {
      try {
        const str = JSON.stringify(value);
        return str.length > 60 ? str.slice(0, 57) + "..." : str;
      } catch {
        return "[object]";
      }
    }
    const str = String(value);
    return str.length > 60 ? str.slice(0, 57) + "..." : str;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <p className="text-muted-foreground text-sm">
          Live view of documents from the <code>exercises</code> collection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription className="text-xs">
            Total documents in <code>exercises</code>:{" "}
            <span className="font-semibold">{data.total}</span>
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
          ) : docs.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No exercise documents found.
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
                          {formatCell(doc[key])}
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

export default ExercisesView;
