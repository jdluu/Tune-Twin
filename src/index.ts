import { serve } from "bun";
import index from "./index.html";
import { Innertube } from "youtubei.js";

const youtube = await Innertube.create();

const server = serve({
  routes: {
    "/api/process-playlist": {
      async POST(req) {
        try {
          const body = await req.json();
          let { playlistId } = body;
          if (!playlistId) return Response.json({ error: "Missing playlistId or URL" }, { status: 400 });

          console.log(`Fetching YouTube playlist: ${playlistId}`);
          
          // Try to extract ID if it's a URL.
          const ytMatch = playlistId.match(/[?&]list=([^#\&\?]+)/);
          if (ytMatch) playlistId = ytMatch[1];

          const playlist = await youtube.music.getPlaylist(playlistId);
          
          const tracks = playlist.items.filter((item: any) => item.id).map((item: any) => ({
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              ...item
          }));
          
          if (!tracks || tracks.length === 0) {
            return Response.json({ error: "Empty playlist or could not find tracks" }, { status: 404 });
          }

          // Recommendation Logic
          const lastTrack = tracks[tracks.length - 1] as any;
          const seedVideoId = lastTrack?.id;
          
          if (!seedVideoId) return Response.json({ error: "Could not identify seed track ID" }, { status: 500 });
          
          console.log(`Fetching recommendations based on seed ID: ${seedVideoId}`);
          const suggestions = await youtube.music.getUpNext(seedVideoId);

          return Response.json({ original: tracks, recommendations: suggestions });

        } catch (error: any) {
          console.error("Error processing playlist:", error);
          return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
        }
      }
    },
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
