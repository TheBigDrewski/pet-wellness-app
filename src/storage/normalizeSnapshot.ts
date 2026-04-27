import {
  AppSnapshot,
  Appointment,
  FeedingLog,
  HealthLog,
  Medication,
  MedicationDose,
  Pet,
  RecordItem,
  VaccineRecord,
  WeightLog,
} from '../types/models';
import { normalizeDateOnly, normalizeDateString, safeNumber, summarizeHealthLog } from '../utils/date';

const SCHEMA_VERSION = 2;

function asObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asArray<T>(value: unknown, map: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(map);
}

function normalizePet(raw: unknown): Pet {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    name: asString(item.name),
    species: asString(item.species) || 'Other',
    breed: asString(item.breed),
    sex: asString(item.sex),
    birthday: asString(item.birthday),
    weightLabel: asString(item.weightLabel),
    colorMarkings: asString(item.colorMarkings),
    microchipNumber: asString(item.microchipNumber),
    vetName: asString(item.vetName),
    vetPhone: asString(item.vetPhone),
    vetClinic: asString(item.vetClinic),
    preferredVetClinic: asString(item.preferredVetClinic),
    photoUri: asString(item.photoUri),
    allergies: asString(item.allergies),
    knownConditions: asString(item.knownConditions),
    currentFood: asString(item.currentFood),
    insuranceProvider: asString(item.insuranceProvider),
    insurancePolicyNumber: asString(item.insurancePolicyNumber),
    emergencyContact: asString(item.emergencyContact),
    notes: asString(item.notes),
    createdAt: asString(item.createdAt) || new Date().toISOString(),
    updatedAt: asString(item.updatedAt) || new Date().toISOString(),
  };
}

function normalizeHealthLog(raw: unknown): HealthLog {
  const item = asObject(raw);
  const normalized = {
    loggedAt: normalizeDateString(asString(item.loggedAt)),
    symptoms: asString(item.symptoms),
    mood: asString(item.mood) || 'Okay',
    energyLevel: asString(item.energyLevel) || 'Normal',
    stoolNotes: asString(item.stoolNotes),
    urineNotes: asString(item.urineNotes),
    vomiting: asString(item.vomiting),
    coughing: asString(item.coughing),
    itching: asString(item.itching),
    injuries: asString(item.injuries),
    notes: asString(item.notes),
  };

  return {
    id: asString(item.id),
    petId: asString(item.petId),
    ...normalized,
    summary: asString(item.summary) || summarizeHealthLog(normalized),
  };
}

function normalizeFeedingLog(raw: unknown): FeedingLog {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    petId: asString(item.petId),
    loggedAt: normalizeDateString(asString(item.loggedAt)),
    category: asString(item.category) || 'Meal',
    foodName: asString(item.foodName),
    brand: asString(item.brand),
    quantity: asString(item.quantity),
    waterIntake: asString(item.waterIntake),
    notes: asString(item.notes),
  };
}

function inferIntervalHours(item: Record<string, unknown>) {
  const scheduleType = asString(item.scheduleType);
  if (scheduleType === 'onceDaily') return 24;
  if (scheduleType === 'twiceDaily') return 12;
  if (scheduleType === 'weekly') return 168;
  const legacyHours = safeNumber(asString(item.frequencyHours), 0);
  return legacyHours || safeNumber(asString(item.intervalHours), 24);
}

function inferScheduleType(item: Record<string, unknown>) {
  const scheduleType = asString(item.scheduleType);
  if (scheduleType) {
    return scheduleType as Medication['scheduleType'];
  }
  const frequencyHours = safeNumber(asString(item.frequencyHours), 24);
  if (frequencyHours <= 12) return 'twiceDaily';
  if (frequencyHours >= 168) return 'weekly';
  return 'onceDaily';
}

function normalizeMedication(raw: unknown): Medication {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    petId: asString(item.petId),
    name: asString(item.name),
    dosage: asString(item.dosage),
    scheduleType: inferScheduleType(item),
    intervalHours: inferIntervalHours(item),
    startAt: normalizeDateString(asString(item.startAt) || `${asString(item.startDate) || new Date().toISOString().slice(0, 10)}T08:00`),
    endAt: asString(item.endAt) || normalizeDateOnly(asString(item.endDate)),
    instructions: asString(item.instructions) || asString(item.notes),
    customScheduleNotes: asString(item.customScheduleNotes),
    createdAt: asString(item.createdAt) || new Date().toISOString(),
  };
}

function normalizeMedicationDose(raw: unknown): MedicationDose {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    medicationId: asString(item.medicationId),
    petId: asString(item.petId),
    scheduledFor: normalizeDateString(asString(item.scheduledFor)),
    status: asString(item.status) === 'skipped' ? 'skipped' : 'given',
    actedAt: normalizeDateString(asString(item.actedAt) || asString(item.lastGivenAt)),
    notes: asString(item.notes),
  };
}

function normalizeAppointment(raw: unknown): Appointment {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    petId: asString(item.petId),
    title: asString(item.title),
    kind: asString(item.kind) || 'Custom',
    scheduledAt: normalizeDateString(asString(item.scheduledAt)),
    location: asString(item.location),
    notes: asString(item.notes),
    completedAt: asString(item.completedAt),
    createdAt: asString(item.createdAt) || new Date().toISOString(),
  };
}

function normalizeWeightLog(raw: unknown): WeightLog {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    petId: asString(item.petId),
    loggedAt: normalizeDateString(asString(item.loggedAt)),
    weight: safeNumber(item.weight as string | number, 0),
    unit: asString(item.unit) || 'lb',
    notes: asString(item.notes),
  };
}

function normalizeRecordItem(raw: unknown): RecordItem {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    petId: asString(item.petId),
    title: asString(item.title),
    kind: asString(item.kind) || 'General',
    dateGiven: normalizeDateOnly(asString(item.dateGiven)),
    expiresAt: normalizeDateOnly(asString(item.expiresAt)),
    provider: asString(item.provider),
    notes: asString(item.notes),
  };
}

function normalizeVaccineRecord(raw: unknown): VaccineRecord {
  const item = asObject(raw);
  return {
    id: asString(item.id),
    petId: asString(item.petId),
    name: asString(item.name) || asString(item.title),
    dateGiven: normalizeDateOnly(asString(item.dateGiven)),
    expiresAt: normalizeDateOnly(asString(item.expiresAt)),
    provider: asString(item.provider),
    lotNumber: asString(item.lotNumber),
    notes: asString(item.notes),
  };
}

function isLikelyVaccineRecord(record: RecordItem) {
  const combined = `${record.title} ${record.kind}`.toLowerCase();
  return /(vaccine|rabies|bordetella|fvrcp|dhpp|distemper|lepto)/.test(combined);
}

function buildLegacyMedicationDoses(medications: Medication[], rawMedications: unknown[]) {
  const byId = new Map(rawMedications.map((item) => [asString(asObject(item).id), asObject(item)]));
  return medications.flatMap((medication) => {
    const legacy = byId.get(medication.id);
    const lastGivenAt = asString(legacy?.lastGivenAt);
    if (!lastGivenAt) {
      return [];
    }
    return [
      {
        id: `${medication.id}-legacy-dose`,
        medicationId: medication.id,
        petId: medication.petId,
        scheduledFor: normalizeDateString(lastGivenAt),
        status: 'given' as const,
        actedAt: normalizeDateString(lastGivenAt),
        notes: 'Imported from previous medication history.',
      },
    ];
  });
}

export function emptySnapshot(): AppSnapshot {
  return {
    schemaVersion: SCHEMA_VERSION,
    pets: [],
    healthLogs: [],
    feedingLogs: [],
    medications: [],
    medicationDoses: [],
    appointments: [],
    weightLogs: [],
    recordItems: [],
    vaccineRecords: [],
  };
}

export function normalizeSnapshot(input: unknown): AppSnapshot {
  const root = asObject(input);
  const hasCoreArray =
    Array.isArray(root.pets) ||
    Array.isArray(root.healthLogs) ||
    Array.isArray(root.feedingLogs) ||
    Array.isArray(root.medications) ||
    Array.isArray(root.appointments) ||
    Array.isArray(root.weightLogs) ||
    Array.isArray(root.recordItems);

  if (!hasCoreArray) {
    throw new Error('Invalid backup: expected pet care data arrays.');
  }

  const pets = asArray(root.pets, normalizePet).filter((item) => item.id && item.name);
  const healthLogs = asArray(root.healthLogs, normalizeHealthLog).filter((item) => item.id && item.petId);
  const feedingLogs = asArray(root.feedingLogs, normalizeFeedingLog).filter((item) => item.id && item.petId);
  const medications = asArray(root.medications, normalizeMedication).filter((item) => item.id && item.petId);
  const rawMedicationDoses = asArray(root.medicationDoses, normalizeMedicationDose);
  const appointments = asArray(root.appointments, normalizeAppointment).filter((item) => item.id && item.petId);
  const weightLogs = asArray(root.weightLogs, normalizeWeightLog).filter((item) => item.id && item.petId);
  const recordItems = asArray(root.recordItems, normalizeRecordItem).filter((item) => item.id && item.petId);
  const vaccineRecords = asArray(root.vaccineRecords, normalizeVaccineRecord).filter((item) => item.id && item.petId);

  const migratedVaccines =
    vaccineRecords.length > 0 ? vaccineRecords : recordItems.filter(isLikelyVaccineRecord).map((record) => ({
      id: `vax-${record.id}`,
      petId: record.petId,
      name: record.title,
      dateGiven: record.dateGiven,
      expiresAt: record.expiresAt,
      provider: record.provider,
      lotNumber: '',
      notes: record.notes,
    }));

  const cleanedRecords =
    vaccineRecords.length > 0 ? recordItems : recordItems.filter((record) => !isLikelyVaccineRecord(record));

  const medicationDoses =
    rawMedicationDoses.length > 0 ? rawMedicationDoses : buildLegacyMedicationDoses(medications, Array.isArray(root.medications) ? root.medications : []);

  return {
    schemaVersion: SCHEMA_VERSION,
    pets,
    healthLogs,
    feedingLogs,
    medications,
    medicationDoses,
    appointments,
    weightLogs,
    recordItems: cleanedRecords,
    vaccineRecords: migratedVaccines,
  };
}
