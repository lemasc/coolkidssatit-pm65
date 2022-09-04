import type { SongRequestRecord } from "../spotify/select";
import type { OrderByDirection } from "firebase/firestore";

export type ListParams = {
  sortBy: keyof SongRequestRecord;
  order: OrderByDirection;
  page?: number;
};