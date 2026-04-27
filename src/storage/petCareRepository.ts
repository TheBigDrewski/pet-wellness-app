import {
  Appointment,
  AppointmentInput,
  FeedingLog,
  FeedingLogInput,
  HealthLog,
  HealthLogInput,
  Medication,
  MedicationDose,
  MedicationDoseStatus,
  MedicationInput,
  Pet,
  PetInput,
  RecordInput,
  RecordItem,
  VaccineInput,
  VaccineRecord,
  WeightInput,
  WeightLog,
} from '../types/models';
import { addHours, normalizeDateOnly, normalizeDateString, safeNumber, summarizeHealthLog } from '../utils/date';
import { createId } from '../utils/ids';

const now = () => new Date().toISOString();

export function createPet(input: PetInput): Pet {
  const timestamp = now();
  return {
    id: createId('pet'),
    name: input.name.trim(),
    species: input.species.trim() || 'Other',
    breed: input.breed.trim(),
    sex: input.sex.trim(),
    birthday: input.birthday.trim(),
    weightLabel: input.weightLabel.trim(),
    colorMarkings: input.colorMarkings.trim(),
    microchipNumber: input.microchipNumber.trim(),
    vetName: input.vetName.trim(),
    vetPhone: input.vetPhone.trim(),
    vetClinic: input.vetClinic.trim(),
    preferredVetClinic: input.preferredVetClinic.trim(),
    photoUri: input.photoUri.trim(),
    allergies: input.allergies.trim(),
    knownConditions: input.knownConditions.trim(),
    currentFood: input.currentFood.trim(),
    insuranceProvider: input.insuranceProvider.trim(),
    insurancePolicyNumber: input.insurancePolicyNumber.trim(),
    emergencyContact: input.emergencyContact.trim(),
    notes: input.notes.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updatePetFromInput(current: Pet, input: PetInput): Pet {
  return {
    ...current,
    name: input.name.trim(),
    species: input.species.trim() || 'Other',
    breed: input.breed.trim(),
    sex: input.sex.trim(),
    birthday: input.birthday.trim(),
    weightLabel: input.weightLabel.trim(),
    colorMarkings: input.colorMarkings.trim(),
    microchipNumber: input.microchipNumber.trim(),
    vetName: input.vetName.trim(),
    vetPhone: input.vetPhone.trim(),
    vetClinic: input.vetClinic.trim(),
    preferredVetClinic: input.preferredVetClinic.trim(),
    photoUri: input.photoUri.trim(),
    allergies: input.allergies.trim(),
    knownConditions: input.knownConditions.trim(),
    currentFood: input.currentFood.trim(),
    insuranceProvider: input.insuranceProvider.trim(),
    insurancePolicyNumber: input.insurancePolicyNumber.trim(),
    emergencyContact: input.emergencyContact.trim(),
    notes: input.notes.trim(),
    updatedAt: now(),
  };
}

export function createHealthLog(petId: string, input: HealthLogInput): HealthLog {
  return {
    id: createId('health'),
    petId,
    loggedAt: normalizeDateString(input.loggedAt),
    symptoms: input.symptoms.trim(),
    mood: input.mood.trim(),
    energyLevel: input.energyLevel.trim(),
    stoolNotes: input.stoolNotes.trim(),
    urineNotes: input.urineNotes.trim(),
    vomiting: input.vomiting.trim(),
    coughing: input.coughing.trim(),
    itching: input.itching.trim(),
    injuries: input.injuries.trim(),
    notes: input.notes.trim(),
    summary: summarizeHealthLog(input),
  };
}

export function createFeedingLog(petId: string, input: FeedingLogInput): FeedingLog {
  return {
    id: createId('feeding'),
    petId,
    loggedAt: normalizeDateString(input.loggedAt),
    category: input.category.trim(),
    foodName: input.foodName.trim(),
    brand: input.brand.trim(),
    quantity: input.quantity.trim(),
    waterIntake: input.waterIntake.trim(),
    notes: input.notes.trim(),
  };
}

function resolveMedicationInterval(input: MedicationInput) {
  if (input.scheduleType === 'onceDaily') return 24;
  if (input.scheduleType === 'twiceDaily') return 12;
  if (input.scheduleType === 'weekly') return 168;
  return safeNumber(input.intervalHours, 24);
}

export function createMedication(petId: string, input: MedicationInput): Medication {
  return {
    id: createId('med'),
    petId,
    name: input.name.trim(),
    dosage: input.dosage.trim(),
    scheduleType: input.scheduleType,
    intervalHours: resolveMedicationInterval(input),
    startAt: normalizeDateString(input.startAt),
    endAt: normalizeDateOnly(input.endAt),
    instructions: input.instructions.trim(),
    customScheduleNotes: input.customScheduleNotes.trim(),
    createdAt: now(),
  };
}

export function createMedicationDose(medication: Medication, status: MedicationDoseStatus, scheduledFor?: string): MedicationDose {
  const dueAt = scheduledFor ? normalizeDateString(scheduledFor) : nextDoseAt(medication, []);
  return {
    id: createId('dose'),
    medicationId: medication.id,
    petId: medication.petId,
    scheduledFor: dueAt,
    status,
    actedAt: now(),
    notes: '',
  };
}

export function nextDoseAt(medication: Medication, doseHistory: MedicationDose[]) {
  const history = doseHistory
    .filter((entry) => entry.medicationId === medication.id)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  const anchor = history[0]?.scheduledFor || medication.startAt;
  return addHours(anchor, medication.intervalHours);
}

export function createAppointment(petId: string, input: AppointmentInput): Appointment {
  return {
    id: createId('appt'),
    petId,
    title: input.title.trim(),
    kind: input.kind.trim(),
    scheduledAt: normalizeDateString(input.scheduledAt),
    location: input.location.trim(),
    notes: input.notes.trim(),
    completedAt: '',
    createdAt: now(),
  };
}

export function createWeightLog(petId: string, input: WeightInput): WeightLog {
  return {
    id: createId('weight'),
    petId,
    loggedAt: normalizeDateString(input.loggedAt),
    weight: safeNumber(input.weight, 0),
    unit: input.unit.trim() || 'lb',
    notes: input.notes.trim(),
  };
}

export function createRecordItem(petId: string, input: RecordInput): RecordItem {
  return {
    id: createId('record'),
    petId,
    title: input.title.trim(),
    kind: input.kind.trim() || 'General',
    dateGiven: normalizeDateOnly(input.dateGiven),
    expiresAt: normalizeDateOnly(input.expiresAt),
    provider: input.provider.trim(),
    notes: input.notes.trim(),
  };
}

export function createVaccineRecord(petId: string, input: VaccineInput): VaccineRecord {
  return {
    id: createId('vaccine'),
    petId,
    name: input.name.trim(),
    dateGiven: normalizeDateOnly(input.dateGiven),
    expiresAt: normalizeDateOnly(input.expiresAt),
    provider: input.provider.trim(),
    lotNumber: input.lotNumber.trim(),
    notes: input.notes.trim(),
  };
}
