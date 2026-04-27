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
  photoUri: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type PetInput = Omit<Pet, 'id' | 'photoUri' | 'createdAt' | 'updatedAt'>;

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

export type Medication = {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequencyHours: number;
  startDate: string;
  endDate: string;
  notes: string;
  lastGivenAt: string;
  createdAt: string;
};

export type MedicationInput = {
  name: string;
  dosage: string;
  frequencyHours: string;
  startDate: string;
  endDate: string;
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
  createdAt: string;
};

export type AppointmentInput = Omit<Appointment, 'id' | 'petId' | 'createdAt'>;

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
  dateGiven: string;
  expiresAt: string;
  provider: string;
  notes: string;
};

export type RecordInput = Omit<RecordItem, 'id' | 'petId'>;

export type AppSnapshot = {
  pets: Pet[];
  healthLogs: HealthLog[];
  feedingLogs: FeedingLog[];
  medications: Medication[];
  appointments: Appointment[];
  weightLogs: WeightLog[];
  recordItems: RecordItem[];
};

export type DashboardPet = Pet & {
  latestWeightLabel: string;
};

export type DashboardTimelineItem = {
  id: string;
  petName: string;
  title: string;
  description: string;
  when: string;
  kind: 'appointment' | 'medication';
};

export type DashboardActivity = {
  id: string;
  petName: string;
  title: string;
  description: string;
  when: string;
  kind: 'health' | 'diet' | 'weight' | 'record';
};
