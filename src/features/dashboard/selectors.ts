import { AppSnapshot, Appointment, DashboardActivity, DashboardPet, DashboardTimelineItem, Medication, Pet, WeightLog } from '../../types/models';
import { addHours, formatWeightLabel, nowIso } from '../../utils/date';

function findPetName(pets: Pet[], petId: string) {
  return pets.find((pet) => pet.id === petId)?.name ?? 'Unknown pet';
}

function getLatestWeight(weightLogs: WeightLog[], petId: string) {
  const matches = weightLogs
    .filter((entry) => entry.petId === petId)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  return matches[0];
}

function medicationDueItem(pets: Pet[], medication: Medication): DashboardTimelineItem {
  const nextDate = medication.lastGivenAt
    ? addHours(medication.lastGivenAt, medication.frequencyHours)
    : `${medication.startDate}T08:00:00.000Z`;

  return {
    id: `due-${medication.id}`,
    petName: findPetName(pets, medication.petId),
    title: `Medication due: ${medication.name}`,
    description: `${medication.dosage} due every ${medication.frequencyHours}h`,
    when: nextDate,
    kind: 'medication',
  };
}

function appointmentItem(pets: Pet[], appointment: Appointment): DashboardTimelineItem {
  return {
    id: appointment.id,
    petName: findPetName(pets, appointment.petId),
    title: appointment.title,
    description: `${appointment.kind}${appointment.location ? ` at ${appointment.location}` : ''}`,
    when: appointment.scheduledAt,
    kind: 'appointment',
  };
}

export function buildDashboardPets(snapshot: AppSnapshot): DashboardPet[] {
  return snapshot.pets.map((pet) => {
    const latestWeight = getLatestWeight(snapshot.weightLogs, pet.id);
    return {
      ...pet,
      latestWeightLabel: latestWeight ? formatWeightLabel(latestWeight.weight, latestWeight.unit) : pet.weightLabel || 'Not recorded',
    };
  });
}

export function buildUpcoming(snapshot: AppSnapshot): DashboardTimelineItem[] {
  const today = nowIso();
  return [
    ...snapshot.appointments.map((appointment) => appointmentItem(snapshot.pets, appointment)),
    ...snapshot.medications.map((medication) => medicationDueItem(snapshot.pets, medication)),
  ]
    .filter((item) => item.when >= today)
    .sort((a, b) => a.when.localeCompare(b.when))
    .slice(0, 8);
}

export function buildPastAppointments(snapshot: AppSnapshot): DashboardTimelineItem[] {
  const today = nowIso();
  return snapshot.appointments
    .map((appointment) => appointmentItem(snapshot.pets, appointment))
    .filter((item) => item.when < today)
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 8);
}

export function buildRecentActivity(snapshot: AppSnapshot): DashboardActivity[] {
  const petName = (petId: string) => findPetName(snapshot.pets, petId);
  const activities: DashboardActivity[] = [
    ...snapshot.healthLogs.map((entry): DashboardActivity => ({
      id: entry.id,
      petName: petName(entry.petId),
      title: entry.symptoms || 'Health note',
      description: entry.summary || entry.notes || 'Health entry saved',
      when: entry.loggedAt,
      kind: 'health',
    })),
    ...snapshot.feedingLogs.map((entry): DashboardActivity => ({
      id: entry.id,
      petName: petName(entry.petId),
      title: `${entry.category}: ${entry.foodName}`,
      description: `${entry.quantity || 'Quantity not set'}${entry.notes ? ` • ${entry.notes}` : ''}`,
      when: entry.loggedAt,
      kind: 'diet',
    })),
    ...snapshot.weightLogs.map((entry): DashboardActivity => ({
      id: entry.id,
      petName: petName(entry.petId),
      title: `Weight check`,
      description: formatWeightLabel(entry.weight, entry.unit),
      when: entry.loggedAt,
      kind: 'weight',
    })),
    ...snapshot.recordItems.map((entry): DashboardActivity => ({
      id: entry.id,
      petName: petName(entry.petId),
      title: entry.title,
      description: entry.provider || 'Record entry',
      when: `${entry.dateGiven}T12:00:00.000Z`,
      kind: 'record',
    })),
  ];

  return activities.sort((a, b) => b.when.localeCompare(a.when)).slice(0, 12);
}
