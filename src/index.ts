import { serve } from "bun";
import index from "./index.html";
import { Innertube } from "youtubei.js";

const youtube = await Innertube.create();

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/process-playlist": {
      async POST(req) {
        try {
          const body = await req.json();
          const { playlistId } = body;

          if (!playlistId) {
            return Response.json({ error: "Missing playlistId" }, { status: 400 });
          }

          console.log(`Fetching playlist: ${playlistId}`);
          
          // 1. Get the playlist details
          const playlist = await youtube.music.getPlaylist(playlistId);
          
          // 2. Extract Video IDs from the playlist items
          const tracks = playlist.items;
          
          if (!tracks || tracks.length === 0) {
            return Response.json({ error: "Empty playlist or could not find tracks" }, { status: 404 });
          }

          // 3. Get Recommendation seed (the last track)
          const lastTrack = tracks[tracks.length - 1];
          // Accessing 'id' of the MusicResponsiveListItem. 
          // Note: In youtubei.js, the item ID is typically at .id
          const lastTrackId = lastTrack?.id;

          if (!lastTrackId) {
             return Response.json({ error: "Could not identify last track ID" }, { status: 500 });
          }

          console.log(`Fetching recommendations based on track: ${lastTrackId}`);

          // 4. Get "Up Next" suggestions based on that track
          const suggestions = await youtube.music.getUpNext(lastTrackId);

          return Response.json({ 
            original: tracks,
            recommendations: suggestions 
          });

        } catch (error: any) {
          console.error("Error processing playlist:", error);
          return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
