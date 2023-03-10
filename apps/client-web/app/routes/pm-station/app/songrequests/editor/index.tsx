import { useState } from "react";

import { PageHeader } from "@station/client/layout";
import { withTitle } from "~/utils/pm-station/client";

import { AdminSongRequest } from "~/components/SongRequest/admin";
import { AdminTrackModal } from "~/components/TrackModal";
import type { SongRequestSearchRecord } from "@station/shared/schema/types";

export const meta = withTitle("จัดการคำขอเพลง");

export default function ListSongRequest() {
  const [track, viewTrack] = useState<SongRequestSearchRecord>();
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
      <AdminTrackModal track={track} onClose={() => viewTrack(undefined)} />
      <AdminSongRequest onItemClick={viewTrack} />
    </>
  );
}
