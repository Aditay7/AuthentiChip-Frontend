import React, { useMemo, useState } from "react";

// HistoryPage.jsx
// - First row shows object keys
// - Contains 51+ mock records
// - Fixed box with internal horizontal scrollbar
// - Pagination: show 50 items per page, "Next" button to go to next page
// - Search input (left side of header) filters by part_number or id
// - Tailwind CSS classes used for quick styling

const KEYS = [
  "id",
  "part_number",
  "original_url",
  "preview_url",
  "timestamp",
  "decision",
  "reasons",
];

// generate 51 mock items
const MOCK = Array.from({ length: 51 }).map((_, i) => {
  const idx = i + 1;
  return {
    id: `uuid-${idx}`,
    part_number: ["ABC123", "DEF456", "GHI789", "JKL012"][i % 4],
    original_url: `s3://bucket/originals/uuid-${idx}.jpg`,
    preview_url: `https://cdn.example.com/previews/uuid-${idx}.webpl`,
    timestamp: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    decision: i % 3 === 0 ? "PASS" : "FAIL",
    reasons: i % 3 === 0 ? [] : [i % 2 ? "marking_mismatch" : "texture_mismatch"],
  };
});

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK;
    const q = query.toLowerCase();
    return MOCK.filter(
      (r) => r.part_number.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  function handleNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }
  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  // reset page when filter changes
  React.useEffect(() => setPage(1), [query]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Inspection History</h1>

        {/* Box that contains the horizontally-scrollable table only */}
        <div className="border rounded-lg bg-white shadow-sm">
          <div className="p-3 border-b flex items-center justify-between gap-4">
            {/* LEFT: Search input */}
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by part number or id"
                className="px-3 py-2 border rounded-md text-sm w-64"
              />
              <button
                onClick={() => setQuery("")}
                className="px-3 py-2 text-sm bg-gray-100 rounded-md border"
              >
                Clear
              </button>
            </div>

            {/* RIGHT: info */}
            <div className="text-xs text-gray-500">Page {page} • {filtered.length} records</div>
          </div>

          {/* Constrained box: vertical height fixed; horizontal overflow allowed inside */}
          <div className="p-4" style={{ height: "calc(100vh - 250px)" }}>
            <div className="h-full w-full border rounded-md overflow-hidden">
              {/* IMPORTANT: horizontal scrollbar is confined to this div */}
              <div className="w-full h-full overflow-auto">
                {/* Inner wrapper ensures table can grow horizontally and cause inner scrollbar */}
                <div className="min-w-[1100px]">
                  <table className="w-full text-left table-auto">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        {/* First row: show only keys */}
                        {KEYS.map((k) => (
                          <th
                            key={k}
                            className="px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                          >
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((row) => (
                        <tr key={row.id} className="even:bg-white odd:bg-gray-50">
                          <td className="px-4 py-3 border-r">{row.id}</td>
                          <td className="px-4 py-3 border-r">{row.part_number}</td>
                          <td className="px-4 py-3 border-r break-words max-w-[280px]">{row.original_url}</td>
                          <td className="px-4 py-3 border-r break-words max-w-[280px]">
                            <a
                              href={row.preview_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-600 underline"
                            >
                              Preview
                            </a>
                          </td>
                          <td className="px-4 py-3 border-r">{new Date(row.timestamp).toLocaleString()}</td>
                          <td className="px-4 py-3 border-r">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                row.decision === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {row.decision}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {row.reasons.length ? (
                              <div className="flex flex-wrap gap-2">
                                {row.reasons.map((r) => (
                                  <span key={r} className="text-xs bg-yellow-100 px-2 py-1 rounded">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* show placeholder if no items */}
                      {pageItems.length === 0 && (
                        <tr>
                          <td colSpan={KEYS.length} className="px-4 py-6 text-center text-gray-500">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="p-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">Scroll inside the box to view more columns — page stays fixed.</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 rounded border bg-white disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
