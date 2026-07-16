export type AuthStackParamList = {
  Login: undefined;
};

export type PatientTabParamList = {
  Home: undefined;
  Progress: undefined;
  CheckIn: undefined;
  Workouts: undefined;
  Resources: undefined;
};

export type ProviderStackParamList = {
  ProviderDashboard: undefined;
  Caseload: undefined;
  PatientDetail: { patientId: string };
  ProviderResources: undefined;
};
