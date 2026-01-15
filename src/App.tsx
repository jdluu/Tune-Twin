import { useState } from "react";
import { Search, Info, ExternalLink, Music2, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
      let playlistId = "";
      try {
        const urlObj = new URL(url);
        playlistId = urlObj.searchParams.get("list") || "";
      } catch (err) {
        playlistId = url;
      }

      if (!playlistId) {
        throw new Error("Please enter a valid YouTube Music Playlist URL or ID");
      }

      const response = await fetch("/api/process-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch playlist data");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrackItems = (recData: any) => {
    return recData?.items || recData?.contents || [];
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <div className="container max-w-6xl mx-auto py-12 px-4 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
            <Music2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-tr from-primary to-primary/60 bg-clip-text text-transparent">
            TuneTwin
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the perfect auditory match for your favorite YouTube Music playlists. 
            Enter a URL below to see what sounds like your vibe.
          </p>
        </header>

        {/* Search Section */}
        <section className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Paste YouTube Music playlist URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-base"
                required
              />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="h-12 px-8 font-semibold shadow-lg shadow-primary/20">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Find Twins"
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Original Playlist */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Music2 className="w-5 h-5 text-primary" />
                    Your Vibe
                  </CardTitle>
                  <CardDescription>Tracks from your playlist</CardDescription>
                </div>
                <div className="px-3 py-1 bg-secondary rounded-full text-xs font-semibold">
                  {data.original.length} Tracks
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.original.map((item: any, index: number) => (
                    <div 
                      key={item.id || index} 
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-border/50"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate group-hover:text-primary transition-colors">
                          {item.title?.runs?.[0]?.text || item.title?.text || "Unknown Title"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate italic">
                          {item.subtitle?.runs?.[0]?.text || item.subtitle?.text || "Unknown Artist"}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground/30">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    TuneTwins
                  </CardTitle>
                  <CardDescription>AI-powered musical matches</CardDescription>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold">
                  Recommended
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTrackItems(data.recommendations).map((item: any, index: number) => (
                    <div 
                      key={item.id || index} 
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-border/50"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate group-hover:text-primary transition-colors">
                          {item.title?.runs?.[0]?.text || item.title?.text || item.title?.toString() || "Unknown Title"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate italic">
                          {item.short_byline?.runs?.[0]?.text || item.subtitle?.runs?.[0]?.text || "Unknown Artist"}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`https://music.youtube.com/watch?v=${item.videoId || item.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Play on YouTube Music"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                  {getTrackItems(data.recommendations).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <Info className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">No recommendations found for this playlist.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <footer className="py-8 text-center text-xs text-muted-foreground opacity-50">
        TuneTwin &copy; {new Date().getFullYear()} • Built with Bun, React 19 & Shadcn UI
      </footer>
    </div>
  );
}

export default App;
