'use client';

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { VibeTag } from "@/lib/types";

interface VibeVisualizerProps {
    /** List of calculated vibe tags with scores. */
    vibes: VibeTag[];
}

/**
 * Visualizes the "Vibe" analysis using animated progress bars.
 * Displays the label, color-coded bar, and percentage score.
 *
 * @param props - VibeVisualizerProps
 */
export function VibeVisualizer({ vibes }: VibeVisualizerProps) {
    if (!vibes || vibes.length === 0) return null;

    return (
        <Box sx={{ px: 3, pb: 3, pt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', color: 'text.secondary' }}>
                Vibe Analysis
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {vibes.map((vibe, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ minWidth: 100, fontWeight: 600 }}>
                            {vibe.label}
                        </Typography>
                        <Box sx={{ flexGrow: 1, position: 'relative' }}>
                             {/* Background track */}
                            <Box 
                                sx={{ 
                                    width: '100%', 
                                    height: 8, 
                                    bgcolor: 'action.hover', 
                                    borderRadius: 4,
                                    overflow: 'hidden'
                                }}
                            >
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${vibe.score || 0}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                    style={{
                                        height: '100%',
                                        backgroundColor: vibe.color,
                                        borderRadius: 4
                                    }}
                                />
                            </Box>
                        </Box>
                        <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right', color: 'text.secondary' }}>
                            {vibe.score}%
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
