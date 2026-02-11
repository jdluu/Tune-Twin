'use client';

import { 
    Alert, 
    AlertTitle, 
    Box, 
    Collapse, 
    IconButton, 
    List, 
    ListItem, 
    Typography
} from "@mui/material";
import type { PlaylistAnalysis, Track } from "@/lib/types";
import { KeyboardArrowDown, KeyboardArrowUp, WarningAmberRounded } from "@mui/icons-material";
import { useState } from "react";

interface OutlierAlertProps {
    analysis: PlaylistAnalysis;
}

/**
 * Displays a collapsible warning alert when outlier tracks are detected.
 * Provides a list of tracks that deviate significantly from the playlist centroid.
 * 
 * @param props - Component properties including the analysis data.
 */
export function OutlierAlert({ analysis }: OutlierAlertProps) {
    const [open, setOpen] = useState(false);
    const outliers = analysis.outliers;

    if (!outliers || outliers.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Alert 
                severity="warning" 
                icon={<WarningAmberRounded fontSize="inherit" />}
                variant="outlined"
                sx={{ 
                    borderRadius: 3,
                    borderColor: 'warning.main',
                    bgcolor: 'transparent'
                }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                }
            >
                <AlertTitle sx={{ fontWeight: 700 }}>
                    {outliers.length} Outliers Detected
                </AlertTitle>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    These tracks might break the flow of the playlist.
                </Typography>
                
                <Collapse in={open} sx={{ mt: 1, width: '100%' }}>
                    <List dense sx={{ bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: 2 }}>
                        {outliers.map((track: Track) => (
                            <ListItem key={track.id} sx={{ py: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>
                                    {track.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    by {track.artist}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </Alert>
        </Box>
    );
}
