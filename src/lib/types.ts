import { Track, PlaylistResult } from './validations';

export type { Track, PlaylistResult };

export interface ActionResponse {
    success: boolean;
    data?: PlaylistResult;
    error?: string;
}
