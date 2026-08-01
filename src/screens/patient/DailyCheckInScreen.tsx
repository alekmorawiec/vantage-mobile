import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
  type ScrollView,
} from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppCard } from "../../components/AppCard";
import { AppInput } from "../../components/AppInput";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import {
  CheckInChoiceGroup,
  CheckInMultiChoiceGroup,
  type CheckInChoice,
} from "../../features/check-in/components/CheckInChoiceGroup";
import {
  getDeviceLocalDay,
  useDailyCheckIn,
} from "../../features/check-in/DailyCheckInContext";
import type {
  DailyCheckIn,
  DailyCheckInInput,
  SymptomChange,
  SymptomDescriptor,
} from "../../features/check-in/checkIn.types";
import { useUser } from "../../features/user/UserContext";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type DailyCheckInScreenProps = {
  onReturnHome: () => void;
};

type Step = 1 | 2 | 3;

type CheckInDraft = {
  symptomIntensity: number | null;
  symptomDescriptors: SymptomDescriptor[];
  symptomChange: SymptomChange | null;
  sleepHours: string;
  sleepMinutes: number | null;
  sleepQuality: number | null;
  energyLevel: number | null;
  concerningChange: boolean | null;
  note: string;
};

const emptyDraft: CheckInDraft = {
  symptomIntensity: null,
  symptomDescriptors: [],
  symptomChange: null,
  sleepHours: "",
  sleepMinutes: null,
  sleepQuality: null,
  energyLevel: null,
  concerningChange: null,
  note: "",
};

const symptomIntensityFirstRow = Array.from({ length: 6 }, (_, value) => ({
  value,
  label: String(value),
  accessibilityLabel:
    value === 0 ? "0, no symptoms" : `${value} out of 10`,
})) satisfies CheckInChoice<number>[];

const symptomIntensitySecondRow = Array.from(
  { length: 5 },
  (_, index) => {
    const value = index + 6;

    return {
      value,
      label: String(value),
      accessibilityLabel:
        value === 10 ? "10, extremely severe symptoms" : `${value} out of 10`,
    };
  },
) satisfies CheckInChoice<number>[];

const symptomChangeChoices = [
  { value: "much_better", label: "Much better" },
  { value: "a_little_better", label: "A little better" },
  { value: "about_the_same", label: "About the same" },
  { value: "a_little_worse", label: "A little worse" },
  { value: "much_worse", label: "Much worse" },
] satisfies CheckInChoice<SymptomChange>[];

const symptomDescriptorChoices = [
  { value: "sharp", label: "Sharp" },
  { value: "dull", label: "Dull" },
  { value: "achy", label: "Achy" },
  { value: "throbbing", label: "Throbbing" },
  { value: "burning", label: "Burning" },
  { value: "tingling", label: "Tingling" },
  { value: "numbness", label: "Numbness" },
  { value: "stiffness", label: "Stiffness" },
  { value: "pressure", label: "Pressure" },
  { value: "other", label: "Other" },
] satisfies CheckInChoice<SymptomDescriptor>[];

const sleepMinuteChoices = [0, 15, 30, 45].map((value) => ({
  value,
  label: String(value),
  accessibilityLabel: `${value} additional minutes`,
})) satisfies CheckInChoice<number>[];

const sleepChoices = [
  { value: 1, label: "Very poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Excellent" },
] satisfies CheckInChoice<number>[];

const energyChoices = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "High" },
  { value: 5, label: "Very high" },
] satisfies CheckInChoice<number>[];

const concerningChangeChoices = [
  { value: false, label: "No" },
  { value: true, label: "Yes" },
] satisfies CheckInChoice<boolean>[];

function draftFromCheckIn(checkIn: DailyCheckIn): CheckInDraft {
  const sleepDuration = checkIn.sleep_duration_minutes;

  return {
    symptomIntensity: checkIn.symptom_intensity,
    symptomDescriptors: checkIn.symptom_descriptors,
    symptomChange: checkIn.symptom_change,
    sleepHours:
      sleepDuration === null ? "" : String(Math.floor(sleepDuration / 60)),
    sleepMinutes: sleepDuration === null ? null : sleepDuration % 60,
    sleepQuality: checkIn.sleep_quality,
    energyLevel: checkIn.energy_level,
    concerningChange: checkIn.concerning_change,
    note: checkIn.note ?? "",
  };
}

function hasDraftValues(draft: CheckInDraft) {
  return (
    draft.symptomIntensity !== null ||
    draft.symptomDescriptors.length > 0 ||
    draft.symptomChange !== null ||
    draft.sleepHours.length > 0 ||
    draft.sleepMinutes !== null ||
    draft.sleepQuality !== null ||
    draft.energyLevel !== null ||
    draft.concerningChange !== null ||
    draft.note.length > 0
  );
}

function getSleepDurationMinutes(draft: CheckInDraft) {
  if (!/^\d+$/.test(draft.sleepHours)) {
    return null;
  }

  const hours = Number(draft.sleepHours);
  const minutes = draft.sleepMinutes ?? 0;

  if (
    !Number.isInteger(hours) ||
    hours < 0 ||
    hours > 24 ||
    ![0, 15, 30, 45].includes(minutes) ||
    (hours === 24 && minutes > 0)
  ) {
    return null;
  }

  const totalMinutes = hours * 60 + minutes;

  return totalMinutes <= 1440 ? totalMinutes : null;
}

function getSleepDurationValidationMessage(draft: CheckInDraft) {
  if (draft.sleepHours.length === 0) {
    return "Enter your whole hours of sleep.";
  }

  if (!/^\d+$/.test(draft.sleepHours)) {
    return "Enter whole hours from 0 to 24.";
  }

  const hours = Number(draft.sleepHours);

  if (!Number.isInteger(hours) || hours < 0 || hours > 24) {
    return "Enter whole hours from 0 to 24.";
  }

  const minutes = draft.sleepMinutes ?? 0;

  if (![0, 15, 30, 45].includes(minutes)) {
    return "Choose 0, 15, 30, or 45 additional minutes.";
  }

  if (hours === 24 && minutes > 0) {
    return "Choose 24 hours with no additional minutes, or enter fewer hours.";
  }

  if (hours * 60 + minutes > 1440) {
    return "Keep total sleep between 0 and 24 hours.";
  }

  return null;
}

function formatSleepDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourLabel = `${hours} hr`;

  return minutes > 0 ? `${hourLabel} ${minutes} min` : hourLabel;
}

export function DailyCheckInScreen({
  onReturnHome,
}: DailyCheckInScreenProps) {
  const { patient } = useUser();
  const {
    todayCheckIn,
    loading,
    error,
    saving,
    refreshTodayCheckIn,
    saveTodayCheckIn,
  } = useDailyCheckIn();
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<CheckInDraft>(emptyDraft);
  const [editing, setEditing] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(true);
  const progressAnimation = useRef(new Animated.Value(1 / 3)).current;
  const scrollViewRef = useRef<ScrollView | null>(null);
  const announceStepChange = useRef(false);

  useEffect(() => {
    announceStepChange.current = false;
    setStep(1);
    setDraft(emptyDraft);
    setEditing(false);
    setValidationMessage(null);
  }, [patient?.id]);

  const currentExpectedDate = getDeviceLocalDay(new Date()).expectedDate;
  const savedTodayCheckIn =
    todayCheckIn?.check_in_date === currentExpectedDate ? todayCheckIn : null;
  const showLoadError =
    Boolean(error) &&
    !savedTodayCheckIn &&
    !editing &&
    !hasDraftValues(draft);

  const stepTitle =
    step === 1
      ? "Symptoms"
      : step === 2
        ? "Sleep and energy"
        : "Anything concerning?";
  const sleepDurationMinutes = getSleepDurationMinutes(draft);
  const formVisible =
    !loading && !showLoadError && !(savedTodayCheckIn && !editing);
  const animatedProgressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    let active = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) {
        setReduceMotionEnabled(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotionEnabled,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const targetProgress = step / 3;

    progressAnimation.stopAnimation();

    if (reduceMotionEnabled) {
      progressAnimation.setValue(targetProgress);
      return;
    }

    const animation = Animated.timing(progressAnimation, {
      duration: 240,
      toValue: targetProgress,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progressAnimation, reduceMotionEnabled, step]);

  useEffect(() => {
    if (!formVisible) {
      return;
    }

    scrollViewRef.current?.scrollTo({ animated: false, y: 0 });

    if (announceStepChange.current) {
      AccessibilityInfo.announceForAccessibility(
        `Step ${step} of 3. ${stepTitle}.`,
      );
      announceStepChange.current = false;
    }
  }, [editing, formVisible, patient?.id, step, stepTitle]);

  const stepValidationMessage = useMemo(() => {
    if (step === 1) {
      if (draft.symptomIntensity === null || draft.symptomChange === null) {
        return "Choose a symptom level and how your symptoms have changed.";
      }
    }

    if (step === 2) {
      const sleepDurationError = getSleepDurationValidationMessage(draft);

      if (sleepDurationError) {
        return sleepDurationError;
      }

      if (draft.sleepQuality === null || draft.energyLevel === null) {
        return "Choose an answer for both sleep and energy.";
      }
    }

    if (step === 3) {
      if (draft.concerningChange === null) {
        return "Choose whether today’s symptom change concerns you.";
      }

      if (draft.note.length > 500) {
        return "Keep your note to 500 characters or fewer.";
      }
    }

    return null;
  }, [draft, step]);

  function updateDraft<Key extends keyof CheckInDraft>(
    key: Key,
    value: CheckInDraft[Key],
  ) {
    setValidationMessage(null);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleSymptomDescriptor(descriptor: SymptomDescriptor) {
    setValidationMessage(null);
    setDraft((current) => {
      if (current.symptomDescriptors.includes(descriptor)) {
        return {
          ...current,
          symptomDescriptors: current.symptomDescriptors.filter(
            (value) => value !== descriptor,
          ),
        };
      }

      if (current.symptomDescriptors.length >= 3) {
        return current;
      }

      return {
        ...current,
        symptomDescriptors: [...current.symptomDescriptors, descriptor],
      };
    });
  }

  function handleSleepHoursChange(value: string) {
    if (/^\d{0,2}$/.test(value)) {
      updateDraft("sleepHours", value);
    }
  }

  function moveToStep(nextStep: Step) {
    announceStepChange.current = true;
    setStep(nextStep);
  }

  function handleBack() {
    setValidationMessage(null);

    if (step === 1) {
      onReturnHome();
      return;
    }

    moveToStep(step === 3 ? 2 : 1);
  }

  async function handleContinue() {
    if (stepValidationMessage) {
      setValidationMessage(stepValidationMessage);
      return;
    }

    setValidationMessage(null);

    if (step < 3) {
      moveToStep(step === 1 ? 2 : 3);
      return;
    }

    if (
      draft.symptomIntensity === null ||
      draft.symptomChange === null ||
      sleepDurationMinutes === null ||
      draft.sleepQuality === null ||
      draft.energyLevel === null ||
      draft.concerningChange === null
    ) {
      return;
    }

    const input: DailyCheckInInput = {
      symptom_intensity: draft.symptomIntensity,
      symptom_descriptors: [...draft.symptomDescriptors],
      symptom_change: draft.symptomChange,
      sleep_duration_minutes: sleepDurationMinutes,
      sleep_quality: draft.sleepQuality,
      energy_level: draft.energyLevel,
      concerning_change: draft.concerningChange,
      note: draft.note.trim().length === 0 ? null : draft.note,
    };
    const savedCheckIn = await saveTodayCheckIn(input);

    if (savedCheckIn) {
      setDraft(draftFromCheckIn(savedCheckIn));
      setEditing(false);
      setStep(1);
    }
  }

  function handleUpdate() {
    if (!savedTodayCheckIn) {
      return;
    }

    setDraft(draftFromCheckIn(savedTodayCheckIn));
    announceStepChange.current = true;
    setStep(1);
    setValidationMessage(null);
    setEditing(true);
  }

  if (loading) {
    return (
      <Screen contentContainerStyle={styles.centeredState}>
        <ActivityIndicator color={colors.accent} size="small" />
        <Text style={styles.stateTitle}>Checking today’s status</Text>
        <Text style={styles.stateDetail}>This should only take a moment.</Text>
      </Screen>
    );
  }

  if (showLoadError) {
    return (
      <Screen scroll>
        <ScreenHeader eyebrow="Daily update" title="Check-In" />
        <AppCard style={styles.stateCard}>
          <Text accessibilityRole="header" style={styles.stateTitle}>
            Check-in status unavailable
          </Text>
          <Text style={styles.stateDetail}>{error}</Text>
          <AppButton
            accessibilityLabel="Retry loading today’s check-in"
            label="Try again"
            onPress={() => void refreshTodayCheckIn()}
            style={styles.stateAction}
          />
        </AppCard>
      </Screen>
    );
  }

  if (savedTodayCheckIn && !editing) {
    return (
      <Screen scroll>
        <ScreenHeader eyebrow="Daily update" title="Check-In" />
        <AppCard style={styles.completionCard}>
          <View accessibilityElementsHidden style={styles.completionMark}>
            <Text style={styles.completionMarkText}>✓</Text>
          </View>
          <Text accessibilityRole="header" style={styles.completionTitle}>
            Today’s check-in is saved.
          </Text>
          <Text style={styles.completionDetail}>
            Your responses support trends and communication with your care
            team. You can update them again today.
          </Text>
          <AppButton
            accessibilityLabel="Return to patient home"
            label="Return home"
            onPress={onReturnHome}
            style={styles.completionPrimaryAction}
          />
          <AppButton
            accessibilityLabel="Update today’s saved check-in"
            label="Update today’s check-in"
            onPress={handleUpdate}
            style={styles.completionSecondaryAction}
            variant="secondary"
          />
        </AppCard>
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      contentContainerStyle={styles.formContent}
      scrollViewRef={scrollViewRef}
      scrollViewProps={{
        automaticallyAdjustKeyboardInsets: true,
        keyboardDismissMode: "interactive",
        keyboardShouldPersistTaps: "handled",
      }}
    >
      <View style={styles.progressSection}>
        <Text style={styles.screenContext}>Check-In</Text>
        <Text style={styles.stepLabel}>Step {step} of 3</Text>
        <Text accessibilityRole="header" style={styles.stepTitle}>
          {stepTitle}
        </Text>
        <View
          accessibilityLabel={`Check-in progress, step ${step} of 3`}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: 3, now: step }}
          style={styles.progressTrack}
        >
          <Animated.View
            style={[styles.progressFill, { width: animatedProgressWidth }]}
          />
        </View>
      </View>

      {step === 1 ? (
        <View style={styles.questions}>
          <View>
            <Text style={styles.question}>
              How strong are the symptoms you are receiving care for today?
            </Text>
            <View style={styles.numberGrid}>
              <CheckInChoiceGroup
                accessibilityLabel="Symptom intensity from 0 to 5"
                choices={symptomIntensityFirstRow}
                compact
                layout="row"
                onSelect={(value) => updateDraft("symptomIntensity", value)}
                selectedValue={draft.symptomIntensity}
              />
              <CheckInChoiceGroup
                accessibilityLabel="Symptom intensity from 6 to 10"
                choices={symptomIntensitySecondRow}
                compact
                layout="row"
                onSelect={(value) => updateDraft("symptomIntensity", value)}
                selectedValue={draft.symptomIntensity}
              />
            </View>
            <View style={styles.endpointLabels}>
              <Text style={styles.endpointLabel}>0 = None</Text>
              <Text style={styles.endpointLabel}>10 = Extremely severe</Text>
            </View>
          </View>

          <View>
            <Text style={styles.question}>
              How would you describe those symptoms?
            </Text>
            <Text style={styles.questionHelper}>
              Select up to 3. This question is optional.
            </Text>
            <CheckInMultiChoiceGroup
              accessibilityLabel="Symptom descriptors, select up to 3"
              choices={symptomDescriptorChoices}
              maximumSelections={3}
              onToggle={toggleSymptomDescriptor}
              selectedValues={draft.symptomDescriptors}
            />
          </View>

          <View>
            <Text style={styles.question}>
              Compared to last session, how are those symptoms?
            </Text>
            <CheckInChoiceGroup
              accessibilityLabel="Symptom change compared with yesterday"
              choices={symptomChangeChoices}
              onSelect={(value) => updateDraft("symptomChange", value)}
              selectedValue={draft.symptomChange}
            />
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.questions}>
          <View>
            <Text style={styles.question}>
              About how much did you sleep last night?
            </Text>
            <AppInput
              accessibilityLabel="Whole hours slept last night"
              inputMode="numeric"
              keyboardType="number-pad"
              label="Whole hours"
              maxLength={2}
              onChangeText={handleSleepHoursChange}
              placeholder="7"
              value={draft.sleepHours}
            />
            <Text style={styles.minuteLabel}>Additional minutes (optional)</Text>
            <CheckInChoiceGroup
              accessibilityLabel="Additional minutes slept"
              choices={sleepMinuteChoices}
              compact
              layout="row"
              onSelect={(value) => updateDraft("sleepMinutes", value)}
              selectedValue={draft.sleepMinutes}
            />
            {sleepDurationMinutes !== null ? (
              <Text
                accessibilityLiveRegion="polite"
                style={styles.sleepSummary}
              >
                Sleep total: {formatSleepDuration(sleepDurationMinutes)}
              </Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.question}>How was your sleep last night?</Text>
            <CheckInChoiceGroup
              accessibilityLabel="Sleep quality"
              choices={sleepChoices}
              onSelect={(value) => updateDraft("sleepQuality", value)}
              selectedValue={draft.sleepQuality}
            />
          </View>

          <View>
            <Text style={styles.question}>How is your energy today?</Text>
            <CheckInChoiceGroup
              accessibilityLabel="Energy level"
              choices={energyChoices}
              onSelect={(value) => updateDraft("energyLevel", value)}
              selectedValue={draft.energyLevel}
            />
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.questions}>
          <View>
            <Text style={styles.question}>
              Have your symptoms changed in a way that concerns you today?
            </Text>
            <CheckInChoiceGroup
              accessibilityLabel="Whether today’s symptom change is concerning"
              choices={concerningChangeChoices}
              layout="row"
              onSelect={(value) => updateDraft("concerningChange", value)}
              selectedValue={draft.concerningChange}
            />
          </View>

          <View>
            <AppInput
              accessibilityLabel="Optional note for your care team"
              label="Anything else you’d like your care team to know?"
              maxLength={500}
              multiline
              numberOfLines={5}
              onChangeText={(value) => updateDraft("note", value)}
              placeholder="Optional note"
              style={styles.noteInput}
              textAlignVertical="top"
              value={draft.note}
            />
            <Text
              accessibilityLabel={`${draft.note.length} of 500 characters used`}
              style={styles.characterCount}
            >
              {draft.note.length}/500
            </Text>
          </View>

          <AppCard style={styles.safetyCard}>
            <Text style={styles.safetyText}>
              Your responses support communication and trends. They do not
              diagnose a condition, clear activity, or replace clinical
              evaluation.
            </Text>
          </AppCard>

          {draft.concerningChange ? (
            <AppCard style={styles.concernCard}>
              <Text style={styles.concernLabel}>Important</Text>
              <Text style={styles.concernText}>
                Vantage does not monitor check-ins in real time. Contact your
                care team about concerning changes. If you think you may need
                urgent help, seek urgent or emergency care.
              </Text>
            </AppCard>
          ) : null}
        </View>
      ) : null}

      {validationMessage ? (
        <Text accessibilityRole="alert" style={styles.validationMessage}>
          {validationMessage}
        </Text>
      ) : null}

      {error ? (
        <Text accessibilityRole="alert" style={styles.saveError}>
          {error}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <AppButton
          accessibilityLabel={step === 1 ? "Return to patient home" : "Previous step"}
          disabled={saving}
          label="Back"
          onPress={handleBack}
          style={styles.action}
          variant="secondary"
        />
        <AppButton
          accessibilityLabel={
            step === 3 ? "Save today’s check-in" : `Continue to step ${step + 1}`
          }
          disabled={saving}
          label={step === 3 ? "Save check-in" : "Continue"}
          onPress={() => void handleContinue()}
          style={styles.action}
        />
      </View>
      {saving ? (
        <Text accessibilityLiveRegion="polite" style={styles.savingStatus}>
          Saving securely…
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  formContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  centeredState: { flex: 1, alignItems: "center", justifyContent: "center" },
  stateCard: { marginTop: spacing.xxl, padding: spacing.xl },
  stateTitle: { ...typography.sectionTitle, color: colors.text },
  stateDetail: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
  stateAction: { marginTop: spacing.xl },
  completionCard: {
    marginTop: spacing.xxl,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.xl,
  },
  completionMark: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.accent,
  },
  completionMarkText: {
    ...typography.sectionTitle,
    color: colors.accentInk,
    fontWeight: "900",
  },
  completionTitle: {
    ...typography.screenTitle,
    marginTop: spacing.xl,
    color: colors.text,
  },
  completionDetail: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  completionPrimaryAction: { marginTop: spacing.xl },
  completionSecondaryAction: { marginTop: spacing.md },
  progressSection: {},
  screenContext: { ...typography.label, color: colors.textMuted },
  stepLabel: {
    ...typography.bodyMuted,
    marginTop: spacing.xs,
    color: colors.accent,
    fontWeight: "700",
  },
  stepTitle: {
    ...typography.screenTitle,
    marginTop: spacing.xs,
    color: colors.text,
  },
  progressTrack: {
    height: 4,
    overflow: "hidden",
    marginTop: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  questions: { gap: spacing.xxl, marginTop: spacing.xl },
  question: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
    color: colors.text,
  },
  questionHelper: {
    ...typography.bodyMuted,
    marginBottom: spacing.md,
    color: colors.textMuted,
  },
  numberGrid: { gap: spacing.xs },
  endpointLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  endpointLabel: { ...typography.caption, color: colors.textMuted },
  minuteLabel: {
    ...typography.label,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.textSubtle,
  },
  sleepSummary: {
    ...typography.bodyMuted,
    marginTop: spacing.md,
    color: colors.accent,
    fontWeight: "700",
  },
  noteInput: { minHeight: 120 },
  characterCount: {
    ...typography.caption,
    alignSelf: "flex-end",
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  safetyCard: { backgroundColor: colors.surfaceRaised },
  safetyText: { ...typography.bodyMuted, color: colors.text },
  concernCard: { borderColor: colors.amber, backgroundColor: colors.surfaceRaised },
  concernLabel: { ...typography.label, color: colors.amber },
  concernText: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
    color: colors.text,
  },
  validationMessage: {
    ...typography.bodyMuted,
    marginTop: spacing.lg,
    color: colors.amber,
  },
  saveError: {
    ...typography.bodyMuted,
    marginTop: spacing.lg,
    color: colors.red,
  },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xxl },
  action: { flex: 1 },
  savingStatus: {
    ...typography.caption,
    minHeight: typography.caption.lineHeight,
    marginTop: spacing.sm,
    textAlign: "center",
    color: colors.textMuted,
  },
});
