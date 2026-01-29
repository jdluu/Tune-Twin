'use client';
import { Grid, Fade } from "@mui/material";
import type { PlaylistResult, Track } from "@/lib/types";

import { useState, useEffect, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";

const Player = dynamic(() => import("./Player").then(mod => mod.Player), { ssr: false });
const ArtistModal = dynamic(() => import("./ArtistModal").then(mod => mod.ArtistModal), { ssr: false });

import { getRecommendationsAction } from "../actions";
import { ResultsList } from "./ResultsList";
import { RecommendationsList } from "./RecommendationsList";
import { usePlayerQueue } from "../hooks/usePlayerQueue";

interface ResultsDisplayProps {
    data: PlaylistResult;
}

/**
 * Component to display the analysis results.
 * Shows original playlist, extracted vibes, and fetches/displays recommendations.
 *
 * @param props - ResultsDisplayProps containing the playlist data.
 */
export function ResultsDisplay({ data }: ResultsDisplayProps) {
    const { playingVideoId, playlistQueue, playTrack, playQueue, closePlayer } = usePlayerQueue();
    const [selectedArtist, setSelectedArtist] = useState<{ id: string; name: string } | null>(null);
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    const fetchRecommendations = useCallback(async (tracks: Track[]) => {
        setLoadingRecs(true);
        // Pick up to 3 random seeds from original
        const seedIds = tracks
            .filter(t => t.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(t => t.id);

        try {
            // Collect all current track IDs to exclude from recommendations
            const excludeIds = tracks.map(t => t.id).filter(id => !!id);
            const res = await getRecommendationsAction(seedIds, excludeIds);
            if (res.success && res.data) {
                setRecommendations(res.data.recommendations);
            }
        } finally {
            setLoadingRecs(false);
        }
    }, []);

    useEffect(() => {
        if (data.original.length > 0) {
            fetchRecommendations(data.original);
        }
    }, [data.original, fetchRecommendations]);

    const vibes = data.vibes || [];

    const handlePlayAllRecommendations = () => {
        if (recommendations.length > 0) {
            playQueue(recommendations[0].id, recommendations.slice(1).map(t => t.id));
        }
    };

    const handlePlayAllSource = () => {
        if (data.original.length > 0) {
            playQueue(data.original[0].id, data.original.slice(1).map(t => t.id));
        }
    };

    const handleSelectArtist = (id: string, name: string) => setSelectedArtist({ id, name });

    return (
        <>
            <Fade in={true} timeout={600}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ResultsList 
                            tracks={data.original} 
                            vibes={vibes} 
                            playingVideoId={playingVideoId} 
                            onPlay={playTrack} 
                            onPlayAll={handlePlayAllSource}
                            onSelectArtist={handleSelectArtist}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <RecommendationsList 
                            recommendations={recommendations} 
                            loading={loadingRecs} 
                            playingVideoId={playingVideoId} 
                            onPlay={playTrack} 
                            onPlayAll={handlePlayAllRecommendations}
                            onSelectArtist={handleSelectArtist}
                        />
                    </Grid>
                </Grid>
            </Fade>

            <Suspense fallback={null}>
                <Player 
                    videoId={playingVideoId} 
                    playlist={playlistQueue}
                    onClose={closePlayer} 
                />
                <ArtistModal 
                    artistId={selectedArtist?.id || null} 
                    artistName={selectedArtist?.name || null} 
                    open={!!selectedArtist} 
                    onClose={() => setSelectedArtist(null)} 
                />
            </Suspense>
        </>
    );
}
