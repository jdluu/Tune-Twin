import { useState } from "react";
import "./index.css";

export function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ original: any[]; recommendations: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Basic extraction of 'list' param
      let playlistId = "";
      try {
        const urlObj = new URL(url);
        playlistId = urlObj.searchParams.get("list") || "";
      } catch (err) {
        // Fallback if user pastes just the ID
        playlistId = url;
      }

      if (!playlistId) {
        throw new Error("Invalid URL or Playlist ID");
      }

      const response = await fetch("/api/process-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>TuneTwin</h1>
        <p>Enter a YouTube Music Playlist URL to find its twin recommendations.</p>
      </header>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="https://music.youtube.com/playlist?list=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing Vibe..." : "Find Twins"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="results-grid">
          <div className="column">
            <h2>Your Vibe</h2>
            <ul className="track-list">
              {data.original.map((item: any, index: number) => (
                <li key={item.id || index} className="track-item">
                  <div className="track-info">
                    <strong>{item.title?.runs?.[0]?.text || item.title?.text || "Unknown Title"}</strong>
                    <span>{item.subtitle?.runs?.[0]?.text || item.subtitle?.text || "Unknown Artist"}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="column">
            <h2>TuneTwins (Recommendations)</h2>
             {/* Note: 'recommendations' from getUpNext might be in a different structure. 
                 Usually it returns an object with `items` or similar. 
                 We need to inspect the structure carefully. 
                 Based on youtubei.js docs/issues, getUpNext returns an object that has an 'items' array or similar.
                 Let's try to render it safely. */}
            
            <ul className="track-list">
              {/* Accessing items from the Automix/UpNext structure. 
                  If 'recommendations' is the direct response from getUpNext, it might be an iterator or object.
                  We assume it has properties like 'items' or we iterate if it's an array.
                  But getUpNext often returns a PlaylistPanel or similar. 
                  Let's check if 'items' exists, otherwise try 'contents'.
              */}
              {(data.recommendations?.items || data.recommendations?.contents || []).map((item: any, index: number) => (
                  <li key={item.id || index} className="track-item">
                  <div className="track-info">
                     {/* The structure of recommendation items might differ slightly */}
                    <strong>{item.title?.runs?.[0]?.text || item.title?.text || item.title?.toString() || "Unknown Title"}</strong>
                    <span>{item.short_byline?.runs?.[0]?.text || item.subtitle?.runs?.[0]?.text || "Unknown Artist"}</span>
                  </div>
                   <a 
                      href={`https://music.youtube.com/watch?v=${item.videoId || item.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="play-btn"
                    >
                      Play
                    </a>
                </li>
              ))}
            </ul>
             {(!data.recommendations?.items && !data.recommendations?.contents) && (
                <p>No recommendations found or unknown format.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
}



