import type { ITrackAidForm } from "@/@types/forms";


type keyOfTrackAid = keyof ITrackAidForm

export const INPUTS_TYPE_ERROR: Record<keyOfTrackAid, string> = {
  IDNumber: "ID must be a number",
  versionNumber: "version Date must be a date"
};