/**
 * LastPlayedDate constraints set on the database records.
 */
export const LastPlayedDate = {
  /** Rejected request. Has a timestamp of `-1` */
  Rejected: new Date(-1),
  /** Idle request. Has a timestamp of `0` */
  Idle: new Date(0),
};

export type TrackStatus = "all" | "idle" | "played" | "rejected";

export const getStatusFromDate = (date?: Date): TrackStatus => {
  // undefined, 0 means idle
  return date?.valueOf()
    ? date.valueOf() > 0
      ? "played"
      : "rejected"
    : "idle";
};
