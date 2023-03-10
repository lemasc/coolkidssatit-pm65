import type { z } from "zod";
import type * as Schema from "./schema";

type PlaylistRecord = z.infer<typeof Schema["PlaylistRecord"]>;
type SetPlaylistAction = z.infer<typeof Schema["SetPlaylistAction"]>;

export type { PlaylistRecord, SetPlaylistAction };
