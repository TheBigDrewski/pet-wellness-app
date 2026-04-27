import { Appointment, AppointmentInput, FeedingLog, FeedingLogInput, HealthLog, HealthLogInput, Medication, MedicationInput, Pet, PetInput, RecordInput, RecordItem, WeightInput, WeightLog } from '../types/models';
import { normalizeDateString, safeNumber, summarizeHealthLog } from '../utils/date';
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
    photoUri: '',
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

export function createMedication(petId: string, input: MedicationInput): Medication {
  return {
    id: createId('med'),
    petId,
    name: input.name.trim(),
    dosage: input.dosage.trim(),
    frequencyHours: safeNumber(input.frequencyHours, 24),
    startDate: input.startDate.trim(),
    endDate: input.endDate.trim(),
    notes: input.notes.trim(),
    lastGivenAt: '',
    createdAt: now(),
  };
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
    dateGiven: input.dateGiven.trim(),
    expiresAt: input.expiresAt.trim(),
    provider: input.provider.trim(),
    notes: input.notes.trim(),
  };
}
