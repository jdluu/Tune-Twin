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
          const { playlistId } = body;
          if (!playlistId) return Response.json({ error: "Missing playlistId" }, { status: 400 });

          console.log(`Fetching playlist: ${playlistId}`);
          const playlist = await youtube.music.getPlaylist(playlistId);
          
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
    },
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
