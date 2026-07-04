import type { UserProfile } from "@/lib/types";
import { currentUser } from "@/lib/data/nav";

/**
 * User profile. Sensitive fields (DOB, Email, Aadhaar, PAN) render behind a
 * Show/Hide toggle — the trust pattern to reuse (design-review Pass 3).
 * Empty optional fields carry an "Add …" affordance rather than a bare "-"
 * (design-review T10).
 *
 * Values below are placeholder sentinels only (obviously-fake name/email/IDs)
 * — do not replace with real personal data. Masking here is cosmetic; wire
 * this to a real API and mask server-side before the value reaches the client.
 */
export const userProfile: UserProfile = {
  fullName: currentUser.fullName,
  userId: "•••••0000",
  avatarUrl: currentUser.avatarUrl,
  language: "English",
  identity: [
    { label: "First Name", value: "Jane", kind: "select", required: true },
    { label: "Last Name", value: "Doe", kind: "select", required: true },
    { label: "Gender", value: "Female", kind: "select", required: true },
    { label: "Date of Birth", value: "01-01-1990", kind: "date", sensitive: true, required: true },
    { label: "Email ID", value: "jane.doe@example.com", sensitive: true, required: true },
    { label: "Aadhaar Number", value: "0000 0000 0000", sensitive: true },
    { label: "PAN", value: "AAAAA0000A", sensitive: true },
    { label: "Address Line 1", value: "" },
    { label: "Address Line 2", value: "" },
    { label: "City", value: "" },
    { label: "State", value: "" },
    { label: "Country", value: "" },
    { label: "Zip Code", value: "" },
  ],
  guardian: [
    { label: "Guardian Registered Name", value: "" },
    { label: "Guardian Registered Email ID", value: "" },
  ],
};
