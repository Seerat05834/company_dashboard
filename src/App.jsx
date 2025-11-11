import React, { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000"; // apne backend ka link (Render pe deploy hone ke baad update kar lena)

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 NEW: Jab page open ho, to backend se first 50 companies fetch karo
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/search`) // no query = default 50 companies
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((json) => {
        if (json.results) setData(json.results);
        else setData(json);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch initial data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Search functionality (same as before)
  useEffect(() => {
    if (!query.trim()) return; // skip empty search (we already have default 50)
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((json) => {
        if (json.results) setData(json.results);
        else setData(json);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to fetch data.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f2fe, #f8fafc)",
        fontFamily: "Segoe UI, Arial, sans-serif",
        padding: "40px",
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#1e3a8a",
            marginBottom: "10px",
            fontWeight: "700",
          }}
        >
          Company Dashboard
        </h1>
        <p style={{ color: "#334155", fontSize: "1rem" }}>
          Explore company data, search by name, and view details in a clean,
          modern interface.
        </p>
      </header>

      {/* Search Input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company name..."
          style={{
            padding: "10px 15px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          onClick={() => setQuery(query)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Search
        </button>
      </div>

      {/* Results */}
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#1e3a8a", marginBottom: "20px" }}>All Results</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && data.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2563eb", color: "white" }}>
                <th style={{ padding: "12px" }}>Company Name</th>
                <th style={{ padding: "12px" }}>Website</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Phone</th>
                <th style={{ padding: "12px" }}>Industry</th>
                <th style={{ padding: "12px" }}>Sent</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#f1f5f9" : "white",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#e0e7ff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "#f1f5f9" : "white")
                  }
                >
                  <td style={{ padding: "10px" }}>
                    {item["Company Name"] || "—"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {item.Website ? (
                      <a
                        href={item.Website}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#2563eb",
                          textDecoration: "none",
                        }}
                      >
                        {item.Website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>{item.Email || "—"}</td>
                  <td style={{ padding: "10px" }}>
                    {item.Phone || "Not Available"}
                  </td>
                  <td style={{ padding: "10px" }}>{item.Industry || "—"}</td>
                  <td style={{ padding: "10px" }}>{item.sent || "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && data.length === 0 && !error && (
          <p style={{ color: "#475569" }}>
            No results found. Try searching for a company.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#475569",
          fontSize: "0.9rem",
        }}
      >
        Built with <b>React</b> + <b>FastAPI</b> · Modern Company Dashboard
      </footer>
    </div>
  );
}
