import { serve } from "bun";


import { Innertube } from "youtubei.js";

const youtube = await Innertube.create();

// @ts-ignore - Bun.serve types can be overly restrictive in dev environments
const server = serve({
  async fetch(req) {
    const url = new URL(req.url);

    // 1. Handle API routes
    if (url.pathname === "/api/process-playlist" && req.method === "POST") {
      try {
        const body = await req.json();
        const { playlistId } = body;
        if (!playlistId) return Response.json({ error: "Missing playlistId" }, { status: 400 });

        console.log(`Fetching playlist: ${playlistId}`);
        const playlist = await youtube.music.getPlaylist(playlistId);
        
        // Filter for items that have an ID (MusicResponsiveListItem)
        const tracks = playlist.items.filter((item: any) => item.id);
        
        if (!tracks || tracks.length === 0) {
          return Response.json({ error: "Empty playlist or could not find tracks" }, { status: 404 });
        }

        const lastTrack = tracks[tracks.length - 1] as any;
        const lastTrackId = lastTrack?.id;
        
        if (!lastTrackId) return Response.json({ error: "Could not identify last track ID" }, { status: 500 });

        console.log(`Fetching recommendations based on track: ${lastTrackId}`);
        const suggestions = await youtube.music.getUpNext(lastTrackId);

        return Response.json({ original: tracks, recommendations: suggestions });
      } catch (error: any) {
        console.error("Error processing playlist:", error);
        return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
      }
    }

    // 2. Allow Bun to handle internal routes (like /_bun/)
    if (url.pathname.startsWith("/_bun/")) {
      return undefined; // Let Bun handle its own internal routes
    }

    // 3. Try to serve static files from src/ (like logo.svg, etc.)
    const filePath = `.` + (url.pathname === "/" ? "/src/index.html" : `/src${url.pathname}`);
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }

    // 4. SPA Fallback: Serve index.html for unmatched non-file routes
    if (!url.pathname.includes(".")) {
      return new Response(Bun.file("./src/index.html"));
    }

    return new Response("Not Found", { status: 404 });
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
