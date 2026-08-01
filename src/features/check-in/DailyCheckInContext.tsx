import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { supabase } from "../../lib/supabase";
import { useUser } from "../user/UserContext";
import type {
  DailyCheckIn,
  DailyCheckInContextValue,
  DailyCheckInInput,
} from "./checkIn.types";

const DailyCheckInContext = createContext<
  DailyCheckInContextValue | undefined
>(undefined);

const checkInColumns =
  "id,patient_id,organization_id,check_in_date,submitted_utc_offset_minutes,symptom_intensity,symptom_descriptors,symptom_change,sleep_duration_minutes,sleep_quality,energy_level,concerning_change,note,created_at,updated_at";

type CheckInOperation =
  | "load"
  | "insert"
  | "update"
  | "insert-race-refetch"
  | "insert-race-update";

type ErrorShape = {
  code?: unknown;
  message?: unknown;
};

type OperationFailure = {
  operation: CheckInOperation;
  cause: unknown;
};

function getErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { code: undefined, message: String(error) };
  }

  const { code, message } = error as ErrorShape;

  return {
    code: typeof code === "string" ? code : undefined,
    message: typeof message === "string" ? message : "Unknown request error",
  };
}

function isUniqueConflict(error: unknown) {
  return getErrorDetails(error).code === "23505";
}

function logOperationFailure(operation: CheckInOperation, error: unknown) {
  if (!__DEV__) {
    return;
  }

  const { code, message } = getErrorDetails(error);

  console.error("Daily check-in request failed.", {
    operation,
    code,
    message,
  });
}

function toOperationFailure(
  operation: CheckInOperation,
  cause: unknown,
): OperationFailure {
  return { operation, cause };
}

function isOperationFailure(error: unknown): error is OperationFailure {
  return (
    error !== null &&
    typeof error === "object" &&
    "operation" in error &&
    "cause" in error
  );
}

function formatDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getDeviceLocalDay(date: Date) {
  return {
    expectedDate: `${date.getFullYear()}-${formatDatePart(
      date.getMonth() + 1,
    )}-${formatDatePart(date.getDate())}`,
    utcOffsetMinutes: -date.getTimezoneOffset(),
  };
}

async function selectTodayCheckIn(patientId: string, date: Date) {
  const { expectedDate } = getDeviceLocalDay(date);
  const { data, error } = await supabase
    .from("patient_check_ins")
    .select(checkInColumns)
    .eq("patient_id", patientId)
    .eq("check_in_date", expectedDate)
    .maybeSingle<DailyCheckIn>();

  if (error) {
    throw error;
  }

  return data;
}

async function updateCheckIn(id: string, input: DailyCheckInInput) {
  const { data, error } = await supabase
    .from("patient_check_ins")
    .update(input)
    .eq("id", id)
    .select(checkInColumns)
    .single<DailyCheckIn>();

  if (error) {
    throw error;
  }

  return data;
}

export function DailyCheckInProvider({ children }: PropsWithChildren) {
  const { patient } = useUser();
  const patientId = patient?.id ?? null;
  const latestPatientId = useRef(patientId);
  const requestId = useRef(0);
  const activeSave = useRef<symbol | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [loading, setLoading] = useState(Boolean(patientId));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  latestPatientId.current = patientId;

  const refreshTodayCheckIn = useCallback(async () => {
    const currentPatientId = patientId;
    const currentRequestId = ++requestId.current;

    if (!currentPatientId) {
      setTodayCheckIn(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await selectTodayCheckIn(currentPatientId, new Date());

      if (
        currentRequestId !== requestId.current ||
        latestPatientId.current !== currentPatientId
      ) {
        return;
      }

      setTodayCheckIn(data);
    } catch (loadError: unknown) {
      if (
        currentRequestId !== requestId.current ||
        latestPatientId.current !== currentPatientId
      ) {
        return;
      }

      logOperationFailure("load", loadError);
      setTodayCheckIn(null);
      setError(
        "We couldn’t confirm today’s check-in. Check your connection and try again.",
      );
    } finally {
      if (
        currentRequestId === requestId.current &&
        latestPatientId.current === currentPatientId
      ) {
        setLoading(false);
      }
    }
  }, [patientId]);

  useEffect(() => {
    void refreshTodayCheckIn();

    return () => {
      requestId.current += 1;
      activeSave.current = null;
    };
  }, [refreshTodayCheckIn]);

  const saveTodayCheckIn = useCallback(
    async (input: DailyCheckInInput) => {
      if (activeSave.current) {
        return null;
      }

      const currentPatientId = patientId;

      if (!currentPatientId) {
        setError("Your patient workspace is not available. Please try again.");
        return null;
      }

      const saveToken = Symbol("daily-check-in-save");
      const currentRequestId = requestId.current;
      activeSave.current = saveToken;
      setSaving(true);
      setError(null);

      try {
        const submissionDate = new Date();
        const { expectedDate, utcOffsetMinutes } =
          getDeviceLocalDay(submissionDate);
        const existingTodayCheckIn =
          todayCheckIn?.check_in_date === expectedDate ? todayCheckIn : null;
        let savedCheckIn: DailyCheckIn;

        if (existingTodayCheckIn) {
          try {
            savedCheckIn = await updateCheckIn(existingTodayCheckIn.id, input);
          } catch (updateError: unknown) {
            throw toOperationFailure("update", updateError);
          }
        } else {
          const { data, error: insertError } = await supabase
            .from("patient_check_ins")
            .insert({
              patient_id: currentPatientId,
              submitted_utc_offset_minutes: utcOffsetMinutes,
              ...input,
            })
            .select(checkInColumns)
            .single<DailyCheckIn>();

          if (!insertError) {
            savedCheckIn = data;
          } else if (isUniqueConflict(insertError)) {
            if (__DEV__) {
              console.warn("Recovering a same-day daily check-in insert race.", {
                operation: "insert",
                code: "23505",
              });
            }

            let racedCheckIn: DailyCheckIn | null;

            try {
              racedCheckIn = await selectTodayCheckIn(
                currentPatientId,
                new Date(),
              );
            } catch (refetchError: unknown) {
              throw toOperationFailure("insert-race-refetch", refetchError);
            }

            if (!racedCheckIn) {
              throw toOperationFailure("insert", insertError);
            }

            try {
              savedCheckIn = await updateCheckIn(racedCheckIn.id, input);
            } catch (raceUpdateError: unknown) {
              throw toOperationFailure(
                "insert-race-update",
                raceUpdateError,
              );
            }
          } else {
            throw toOperationFailure("insert", insertError);
          }
        }

        if (
          currentRequestId !== requestId.current ||
          latestPatientId.current !== currentPatientId
        ) {
          return null;
        }

        setTodayCheckIn(savedCheckIn);
        setError(null);
        return savedCheckIn;
      } catch (saveError: unknown) {
        if (
          currentRequestId !== requestId.current ||
          latestPatientId.current !== currentPatientId
        ) {
          return null;
        }

        const failure = isOperationFailure(saveError)
          ? saveError
          : toOperationFailure("insert", saveError);
        logOperationFailure(failure.operation, failure.cause);
        setError(
          "We couldn’t save your check-in. Your responses are still here so you can try again.",
        );
        return null;
      } finally {
        if (activeSave.current === saveToken) {
          activeSave.current = null;
        }

        if (
          currentRequestId === requestId.current &&
          latestPatientId.current === currentPatientId
        ) {
          setSaving(false);
        }
      }
    },
    [patientId, todayCheckIn],
  );

  const value = useMemo<DailyCheckInContextValue>(
    () => ({
      todayCheckIn,
      loading,
      error,
      saving,
      refreshTodayCheckIn,
      saveTodayCheckIn,
    }),
    [
      error,
      loading,
      refreshTodayCheckIn,
      saveTodayCheckIn,
      saving,
      todayCheckIn,
    ],
  );

  return (
    <DailyCheckInContext.Provider value={value}>
      {children}
    </DailyCheckInContext.Provider>
  );
}

export function useDailyCheckIn() {
  const context = useContext(DailyCheckInContext);

  if (!context) {
    throw new Error(
      "useDailyCheckIn must be used inside DailyCheckInProvider.",
    );
  }

  return context;
}
