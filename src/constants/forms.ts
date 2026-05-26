import { ITrackAidForm } from "../@types/forms";

type keyOfTrackAid = keyof ITrackAidForm

export const INPUTS_TYPE_ERROR: Record<keyOfTrackAid, String> = {
  IDNumber: "ID must be a number",
  versionNumber: "version Date must be a date"
};