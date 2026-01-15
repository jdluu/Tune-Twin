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
          
          // Helper to extract text from various InnerTube formats
          const getText = (data: any) => {
              if (!data) return "";
              if (typeof data === 'string') return data;
              if (data.text) return data.text;
              if (data.runs) return data.runs.map((r: any) => r.text).join("");
              return "";
          };

          // Helper to get thumbnail
          const getThumbnail = (data: any) => {
              // Try multiple possible paths for thumbnail data
              const thumbs = data.thumbnail?.contents?.[0]?.image?.sources ||
                            data.thumbnail?.thumbnails ||
                            data.thumbnails;
              if (thumbs && Array.isArray(thumbs) && thumbs.length > 0) {
                  // Get the last one (usually highest quality)
                  return thumbs[thumbs.length - 1].url || thumbs[0].url || "";
              }
              return null; // Return null instead of empty string to avoid empty src
          }

          const sanitizeTrack = (item: any) => {
              // Extract Artist
              let artist = "";
              if (item.artists && Array.isArray(item.artists)) {
                  artist = item.artists.map((a: any) => a.name).join(", ");
              } else {
                  artist = getText(item.subtitle) || getText(item.short_byline) || getText(item.long_byline) || getText(item.author);
              }

              return {
                  id: item.video_id || item.videoId || item.id,
                  title: getText(item.title),
                  artist: artist,
                  thumbnail: getThumbnail(item),
                  duration: getText(item.duration) || getText(item.length),
                  album: getText(item.album)
              };
          };

          // Filter for items that look like tracks (have an ID)
          const validItems = playlist.items.filter((item: any) => item.id || item.videoId);
          
          const tracks = validItems.map((item: any) => sanitizeTrack(item));
          
          if (!tracks || tracks.length === 0) {
            return Response.json({ error: "Empty playlist or could not find tracks" }, { status: 404 });
          }

          // Recommendation Logic
          const lastTrack = tracks[tracks.length - 1];
          const seedVideoId = lastTrack?.id;
          
          if (!seedVideoId) return Response.json({ error: "Could not identify seed track ID" }, { status: 500 });
          
          console.log(`Fetching recommendations based on seed ID: ${seedVideoId}`);
          const upNext = await youtube.music.getUpNext(seedVideoId);

          // DEBUG: Log the structure
          console.log("UpNext response keys:", Object.keys(upNext));
          console.log("UpNext.items:", upNext.items ? `Array(${upNext.items.length})` : "undefined");
          console.log("UpNext.contents:", upNext.contents ? `Array(${upNext.contents.length})` : "undefined");

          // Recommendations can be in .items or .contents depending on the response type
          const recItemsRaw = upNext.items || upNext.contents || [];
          console.log("Raw recommendation items found:", recItemsRaw.length);
          
          // DEBUG: Log first item structure
          if (recItemsRaw.length > 0) {
              const first = recItemsRaw[0];
              console.log("First rec item type:", first.type);
              console.log("First rec item keys:", Object.keys(first));
              console.log("First rec item.video_id:", first.video_id);
              console.log("First rec item.videoId:", first.videoId);
              console.log("First rec item.id:", first.id);
              // Check if it's wrapped
              if (first.video) {
                  console.log("Wrapped in .video:", Object.keys(first.video));
              }
              if (first.content) {
                  console.log("Wrapped in .content:", Object.keys(first.content));
              }
          }
          
          const recommendations = recItemsRaw
            .filter((item: any) => item.videoId || item.id || item.video_id)
            .map((item: any) => sanitizeTrack(item));

          console.log("Sanitized recommendations:", recommendations.length);

          return Response.json({ 
              original: tracks, 
              recommendations: recommendations 
          });

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
