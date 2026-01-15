import { serve } from "bun";
import index from "./index.html";
import { Innertube } from "youtubei.js";
import SpotifyWebApi from "spotify-web-api-node";

const youtube = await Innertube.create();

// Initialize Spotify API (requires env vars)
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Helper to get fresh Spotify token
async function getSpotifyToken() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify credentials missing. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.");
  }
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
}

const server = serve({
  routes: {
    "/api/process-playlist": {
      async POST(req) {
        try {
          const body = await req.json();
          let { playlistId } = body;
          if (!playlistId) return Response.json({ error: "Missing playlistId or URL" }, { status: 400 });

          // Check if input is a Spotify URL
          const isSpotify = playlistId.includes("spotify.com") || playlistId.startsWith("spotify:");
          
          let tracks = [];
          
          if (isSpotify) {
             // Extract Spotify ID
             const match = playlistId.match(/playlist[\/:]([a-zA-Z0-9]{22})/);
             if (!match) return Response.json({ error: "Invalid Spotify Playlist URL" }, { status: 400 });
             const spotifyId = match[1];

             try {
               await getSpotifyToken();
               const spotifyData = await spotifyApi.getPlaylist(spotifyId);
               
               // Map Spotify tracks to a format similar to what frontend expects (ad-hoc)
               // We need to map them to look like the YouTube items for consistency in UI or map both to a common type.
               // Frontend expects: title.runs[0].text, subtitle.runs[0].text (from YouTube)
               // Let's normalize data before sending to frontend? 
               // Or just mock the YouTube structure for now to avoid frontend rewrite.
               
               tracks = spotifyData.body.tracks.items.map(item => ({
                 id: item.track?.id,
                 title: { text: item.track?.name },
                 subtitle: { text: item.track?.artists.map(a => a.name).join(", ") },
                 // Store clean data for seeding
                 artistName: item.track?.artists[0]?.name,
                 trackName: item.track?.name
               })).filter(t => t.id); // Filter out nulls

               console.log(`Fetched ${tracks.length} tracks from Spotify.`);

             } catch (err: any) {
               console.error("Spotify API Error:", err);
               return Response.json({ error: `Spotify Error: ${err.message}` }, { status: 500 });
             }

          } else {
            // YouTube Logic
            // Clean up URL if needed or just pass to youtubei.js (it handles IDs and URLs usually)
            // But let's try to be safe. If it's a full URL, youtubei might handle it.
            // If it is just ID, it works.
            
            console.log(`Fetching YouTube playlist: ${playlistId}`);
            // youtubei.js can handle full URLs in getPlaylist?
            // Usually it expects an ID. Let's try to extract ID if it's a URL.
            const ytMatch = playlistId.match(/[?&]list=([^#\&\?]+)/);
            if (ytMatch) playlistId = ytMatch[1];

            const playlist = await youtube.music.getPlaylist(playlistId);
            tracks = playlist.items.filter((item: any) => item.id).map((item: any) => ({
                id: item.id,
                title: item.title, // youtubei object
                subtitle: item.subtitle, // youtubei object
                // We'll trust youtubei structure for now, but we might need 'title.text' access later
                // The frontend handles 'title.runs[0].text' or 'title.text'. 
                // We pass the raw youtubei object which has getters or properties.
                ...item
            }));
          }
          
          if (!tracks || tracks.length === 0) {
            return Response.json({ error: "Empty playlist or could not find tracks" }, { status: 404 });
          }

          // Recommendation Logic
          const lastTrack = tracks[tracks.length - 1] as any;
          let seedVideoId = lastTrack?.id;

          // If Spotify, we need to find the YouTube ID for the last track
          if (isSpotify) {
             const query = `${lastTrack.trackName} ${lastTrack.artistName}`;
             console.log(`Searching YouTube Music for twin seed: ${query}`);
             const searchResults = await youtube.music.search(query, { type: "song" });
             
             if (!searchResults.contents || searchResults.contents.length === 0) {
                 return Response.json({ error: "Could not find seed track on YouTube Music" }, { status: 404 });
             }
             // Get first result
             seedVideoId = searchResults.contents[0]?.id;
          }
          
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
