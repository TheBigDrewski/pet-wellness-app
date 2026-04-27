export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  birthday: string;
  weightLabel: string;
  colorMarkings: string;
  microchipNumber: string;
  vetName: string;
  vetPhone: string;
  vetClinic: string;
  preferredVetClinic: string;
  photoUri: string;
  allergies: string;
  knownConditions: string;
  currentFood: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  emergencyContact: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type PetInput = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>;

export type HealthLog = {
  id: string;
  petId: string;
  loggedAt: string;
  symptoms: string;
  mood: string;
  energyLevel: string;
  stoolNotes: string;
  urineNotes: string;
  vomiting: string;
  coughing: string;
  itching: string;
  injuries: string;
  notes: string;
  summary: string;
};

export type HealthLogInput = Omit<HealthLog, 'id' | 'petId' | 'summary'>;

export type FeedingLog = {
  id: string;
  petId: string;
  loggedAt: string;
  category: string;
  foodName: string;
  brand: string;
  quantity: string;
  waterIntake: string;
  notes: string;
};

export type FeedingLogInput = Omit<FeedingLog, 'id' | 'petId'>;

export type MedicationScheduleType = 'onceDaily' | 'twiceDaily' | 'everyXHours' | 'weekly' | 'custom';
export type MedicationDoseStatus = 'given' | 'skipped';

export type Medication = {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  scheduleType: MedicationScheduleType;
  intervalHours: number;
  startAt: string;
  endAt: string;
  instructions: string;
  customScheduleNotes: string;
  createdAt: string;
};

export type MedicationInput = {
  name: string;
  dosage: string;
  scheduleType: MedicationScheduleType;
  intervalHours: string;
  startAt: string;
  endAt: string;
  instructions: string;
  customScheduleNotes: string;
};

export type MedicationDose = {
  id: string;
  medicationId: string;
  petId: string;
  scheduledFor: string;
  status: MedicationDoseStatus;
  actedAt: string;
  notes: string;
};

export type Appointment = {
  id: string;
  petId: string;
  title: string;
  kind: string;
  scheduledAt: string;
  location: string;
  notes: string;
  completedAt: string;
  createdAt: string;
};

export type AppointmentInput = Omit<Appointment, 'id' | 'petId' | 'completedAt' | 'createdAt'>;

export type WeightLog = {
  id: string;
  petId: string;
  loggedAt: string;
  weight: number;
  unit: string;
  notes: string;
};

export type WeightInput = {
  loggedAt: string;
  weight: string;
  unit: string;
  notes: string;
};

export type RecordItem = {
  id: string;
  petId: string;
  title: string;
  kind: string;
  dateGiven: string;
  expiresAt: string;
  provider: string;
  notes: string;
};

export type RecordInput = Omit<RecordItem, 'id' | 'petId'>;

export type VaccineRecord = {
  id: string;
  petId: string;
  name: string;
  dateGiven: string;
  expiresAt: string;
  provider: string;
  lotNumber: string;
  notes: string;
};

export type VaccineInput = Omit<VaccineRecord, 'id' | 'petId'>;

export type AppSnapshot = {
  schemaVersion: number;
  pets: Pet[];
  healthLogs: HealthLog[];
  feedingLogs: FeedingLog[];
  medications: Medication[];
  medicationDoses: MedicationDose[];
  appointments: Appointment[];
  weightLogs: WeightLog[];
  recordItems: RecordItem[];
  vaccineRecords: VaccineRecord[];
};

export type TimelineEventType = 'health' | 'feeding' | 'dose' | 'appointment' | 'weight' | 'record' | 'vaccine';
export type DueStatus = 'overdue' | 'dueToday' | 'upcoming' | 'completed' | 'current' | 'expiringSoon' | 'expired';

export type TimelineEvent = {
  id: string;
  petId: string;
  petName: string;
  date: string;
  type: TimelineEventType;
  title: string;
  subtitle: string;
  notes: string;
  status?: DueStatus;
};

export type UpcomingItem = TimelineEvent & {
  group: 'Today' | 'This week' | 'Later' | 'Past';
};

export type DashboardPet = Pet & {
  latestWeightLabel: string;
  careScore: number;
  statusSummary: string;
  overdueCount: number;
  activeMedicationCount: number;
  recentConcern: string;
  nextDueLabel: string;
  vaccineStatus: string;
};

export type DashboardAlert = {
  id: string;
  petId: string;
  petName: string;
  title: string;
  detail: string;
  status: 'warning' | 'info';
};
