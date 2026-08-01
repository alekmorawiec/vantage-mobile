export type SymptomChange =
  | "much_better"
  | "a_little_better"
  | "about_the_same"
  | "a_little_worse"
  | "much_worse";

export type SymptomDescriptor =
  | "sharp"
  | "dull"
  | "achy"
  | "throbbing"
  | "burning"
  | "tingling"
  | "numbness"
  | "stiffness"
  | "pressure"
  | "other";

export type DailyCheckIn = {
  id: string;
  patient_id: string;
  organization_id: string | null;
  check_in_date: string;
  submitted_utc_offset_minutes: number;
  symptom_intensity: number;
  symptom_descriptors: SymptomDescriptor[];
  symptom_change: SymptomChange;
  sleep_duration_minutes: number | null;
  sleep_quality: number;
  energy_level: number;
  concerning_change: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type DailyCheckInInput = {
  symptom_intensity: number;
  symptom_descriptors: SymptomDescriptor[];
  symptom_change: SymptomChange;
  sleep_duration_minutes: number;
  sleep_quality: number;
  energy_level: number;
  concerning_change: boolean;
  note: string | null;
};

export type DailyCheckInContextValue = {
  todayCheckIn: DailyCheckIn | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  refreshTodayCheckIn: () => Promise<void>;
  saveTodayCheckIn: (
    input: DailyCheckInInput,
  ) => Promise<DailyCheckIn | null>;
};
