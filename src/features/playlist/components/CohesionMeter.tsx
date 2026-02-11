'use client';

import { Box, Paper, Typography, useTheme } from "@mui/material";
import type { PlaylistAnalysis } from "@/lib/types";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

interface CohesionMeterProps {
    analysis: PlaylistAnalysis;
}

/**
 * Displays a visual breakdown of playlist cohesion and vibe metrics.
 * Uses a radar chart to represent Energy, Mood, and Rhythm.
 * 
 * @param props - Component properties including the analysis data.
 */
export function CohesionMeter({ analysis }: CohesionMeterProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const data = [
        { subject: 'Energy', A: analysis.dominantVibes.energy * 100, fullMark: 100 },
        { subject: 'Mood', A: analysis.dominantVibes.mood * 100, fullMark: 100 },
        { subject: 'Rhythm', A: analysis.dominantVibes.dance * 100, fullMark: 100 },
    ];

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 4, 
                border: 1, 
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                background: isDark 
                    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255,255,255,0.05) 100%)`
                    : `linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)`
            }}
        >
            <Box>
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.2}>
                    Playlist Cohesion
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h2" fontWeight={800} color={analysis.details.color}>
                        {analysis.cohesionScore}%
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                         / 100
                    </Typography>
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1, color: analysis.details.color }}>
                    {analysis.details.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, maxWidth: 200 }}>
                    Based on keyword vector analysis of titles and artists.
                </Typography>
            </Box>

            <Box sx={{ width: 200, height: 180, position: 'relative' }}>
               <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke={isDark ? "#444" : "#e0e0e0"} />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: theme.palette.text.secondary, fontSize: 10 }} 
                        />
                        <Radar
                            name="Vibe"
                            dataKey="A"
                            stroke={analysis.details.color}
                            fill={analysis.details.color}
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
                {/* Center Label Overlay if needed */}
            </Box>
        </Paper>
    );
}
