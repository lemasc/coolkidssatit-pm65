import type {
  SongRequestRecord,
  TrackResponse,
} from "@station/shared/schema/types";
import type { MusicInfo } from "@station/shared/ytmusic";

export type LoginAction = {
  token: string;
  continueUrl: string;
};

/**
 * Contains the CSRF token to verify the action on the server.
 */
export interface ActionWithSession {
  sessionToken: string;
}

export type SessionActionResponse = {
  success: boolean;
  token: string;
};

export interface SelectTrackAction extends ActionWithSession {
  trackId: string;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export interface SelectTrackActionResponse extends ActionResponse {
  track?: TrackResponse;
  code?: string;
}

export interface ListSongRequestsResponse extends ActionResponse {
  data: SongRequestRecord[];
}

export interface DeletePlaylistAction {
  playlistId: string;
}

export type PlaylistSyncParam = {
  folderId: string;
  date: string;
};

export interface SearchActionResponse extends ActionResponse {
  data?: MusicInfo[];
}
