import {
  AppSnapshot,
  DashboardAlert,
  DashboardPet,
  Medication,
  MedicationDose,
  Pet,
  TimelineEvent,
  UpcomingItem,
  VaccineRecord,
  WeightLog,
} from '../../types/models';
import {
  endOfWeekFromToday,
  formatWeightLabel,
  getDueStatus,
  getVaccineStatus,
  isWithinLastDays,
  nowIso,
  toMiddayIso,
} from '../../utils/date';
import { nextDoseAt } from '../../storage/petCareRepository';

function findPet(pets: Pet[], petId: string) {
  return pets.find((pet) => pet.id === petId);
}

function findPetName(pets: Pet[], petId: string) {
  return findPet(pets, petId)?.name ?? 'Unknown pet';
}

function sortNewest<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function latestWeight(weightLogs: WeightLog[], petId: string) {
  return weightLogs
    .filter((entry) => entry.petId === petId)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))[0];
}

function latestHealthConcern(snapshot: AppSnapshot, petId: string) {
  return snapshot.healthLogs
    .filter((entry) => entry.petId === petId)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))[0];
}

function activeMedications(snapshot: AppSnapshot, petId: string) {
  const today = nowIso().slice(0, 10);
  return snapshot.medications.filter(
    (entry) => entry.petId === petId && (!entry.endAt || entry.endAt >= today)
  );
}

function nextAppointment(snapshot: AppSnapshot, petId: string) {
  const now = nowIso();
  return snapshot.appointments
    .filter((entry) => entry.petId === petId && !entry.completedAt && entry.scheduledAt >= now)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
}

function petVaccineStatus(vaccines: VaccineRecord[], petId: string) {
  const matches = vaccines.filter((entry) => entry.petId === petId);
  if (!matches.length) {
    return 'No vaccines recorded';
  }
  const statuses = matches.map((entry) => getVaccineStatus(entry.expiresAt));
  if (statuses.includes('expired')) {
    return 'Expired vaccine needs review';
  }
  if (statuses.includes('expiringSoon')) {
    return 'Vaccine expiring soon';
  }
  return 'Vaccines current';
}

function medicationEvent(snapshot: AppSnapshot, medication: Medication, doseHistory: MedicationDose[]): TimelineEvent {
  const nextDue = nextDoseAt(medication, doseHistory);
  return {
    id: `med-${medication.id}`,
    petId: medication.petId,
    petName: findPetName(snapshot.pets, medication.petId),
    date: nextDue,
    type: 'dose',
    title: medication.name,
    subtitle: `${medication.dosage} • ${formatMedicationSchedule(medication)}`,
    notes: medication.instructions || medication.customScheduleNotes || 'Medication dose due',
    status: getDueStatus(nextDue),
  };
}

export function buildTimeline(snapshot: AppSnapshot, petId?: string): TimelineEvent[] {
  const petName = (id: string) => findPetName(snapshot.pets, id);

  const events: TimelineEvent[] = [
    ...snapshot.healthLogs.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: entry.loggedAt,
      type: 'health' as const,
      title: entry.symptoms || 'Health update',
      subtitle: `${entry.mood} mood • ${entry.energyLevel} energy`,
      notes: entry.summary || entry.notes,
    })),
    ...snapshot.feedingLogs.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: entry.loggedAt,
      type: 'feeding' as const,
      title: `${entry.category}: ${entry.foodName}`,
      subtitle: entry.brand || entry.quantity || 'Feeding log',
      notes: [entry.quantity, entry.waterIntake ? `Water ${entry.waterIntake}` : '', entry.notes].filter(Boolean).join(' • '),
    })),
    ...snapshot.medicationDoses.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: entry.actedAt || entry.scheduledFor,
      type: 'dose' as const,
      title: `${entry.status === 'given' ? 'Dose given' : 'Dose skipped'}`,
      subtitle: snapshot.medications.find((med) => med.id === entry.medicationId)?.name || 'Medication',
      notes: [entry.scheduledFor ? `Scheduled ${entry.scheduledFor}` : '', entry.notes].filter(Boolean).join(' • '),
      status: entry.status === 'given' ? ('completed' as const) : ('overdue' as const),
    })),
    ...snapshot.appointments.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: entry.completedAt || entry.scheduledAt,
      type: 'appointment' as const,
      title: entry.title,
      subtitle: `${entry.kind}${entry.location ? ` • ${entry.location}` : ''}`,
      notes: entry.notes || 'Appointment/reminder',
      status: getDueStatus(entry.scheduledAt, entry.completedAt),
    })),
    ...snapshot.weightLogs.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: entry.loggedAt,
      type: 'weight' as const,
      title: 'Weight logged',
      subtitle: formatWeightLabel(entry.weight, entry.unit),
      notes: entry.notes,
    })),
    ...snapshot.recordItems.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: toMiddayIso(entry.dateGiven),
      type: 'record' as const,
      title: entry.title,
      subtitle: entry.kind || 'General record',
      notes: [entry.provider, entry.expiresAt ? `Expires ${entry.expiresAt}` : '', entry.notes].filter(Boolean).join(' • '),
      status: entry.expiresAt ? getDueStatus(toMiddayIso(entry.expiresAt)) : undefined,
    })),
    ...snapshot.vaccineRecords.map((entry) => ({
      id: entry.id,
      petId: entry.petId,
      petName: petName(entry.petId),
      date: toMiddayIso(entry.dateGiven),
      type: 'vaccine' as const,
      title: entry.name,
      subtitle: entry.provider || 'Vaccine record',
      notes: [entry.expiresAt ? `Next due ${entry.expiresAt}` : '', entry.lotNumber ? `Lot ${entry.lotNumber}` : '', entry.notes].filter(Boolean).join(' • '),
      status: getVaccineStatus(entry.expiresAt),
    })),
  ];

  const filtered = petId ? events.filter((entry) => entry.petId === petId) : events;
  return sortNewest(filtered);
}

export function buildUpcoming(snapshot: AppSnapshot): UpcomingItem[] {
  const upcomingBase: TimelineEvent[] = [
    ...snapshot.appointments.map((entry) => ({
      id: `upcoming-${entry.id}`,
      petId: entry.petId,
      petName: findPetName(snapshot.pets, entry.petId),
      date: entry.scheduledAt,
      type: 'appointment' as const,
      title: entry.title,
      subtitle: `${entry.kind}${entry.location ? ` • ${entry.location}` : ''}`,
      notes: entry.notes,
      status: getDueStatus(entry.scheduledAt, entry.completedAt),
    })),
    ...snapshot.medications.map((entry) => medicationEvent(snapshot, entry, snapshot.medicationDoses)),
    ...snapshot.vaccineRecords
      .filter((entry) => entry.expiresAt)
      .map((entry) => ({
        id: `vaccine-due-${entry.id}`,
        petId: entry.petId,
        petName: findPetName(snapshot.pets, entry.petId),
        date: toMiddayIso(entry.expiresAt),
        type: 'vaccine' as const,
        title: `${entry.name} due`,
        subtitle: entry.provider || 'Vaccine follow-up',
        notes: entry.notes,
        status: getVaccineStatus(entry.expiresAt),
      })),
  ];

  return upcomingBase
    .map((item) => ({
      ...item,
      group: dueGroup(item.date),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function dueGroup(date: string): UpcomingItem['group'] {
  const due = new Date(date);
  if (Number.isNaN(due.getTime())) {
    return 'Later';
  }
  if (due < new Date()) {
    return 'Past';
  }
  if (due.toDateString() === new Date().toDateString()) {
    return 'Today';
  }
  if (due <= endOfWeekFromToday()) {
    return 'This week';
  }
  return 'Later';
}

export function formatMedicationSchedule(medication: Medication) {
  if (medication.scheduleType === 'onceDaily') return 'Once daily';
  if (medication.scheduleType === 'twiceDaily') return 'Twice daily';
  if (medication.scheduleType === 'weekly') return 'Weekly';
  if (medication.scheduleType === 'everyXHours') return `Every ${medication.intervalHours} hours`;
  return medication.customScheduleNotes || `Every ${medication.intervalHours} hours`;
}

export function buildDashboardPets(snapshot: AppSnapshot): DashboardPet[] {
  return snapshot.pets.map((pet) => {
    const latest = latestWeight(snapshot.weightLogs, pet.id);
    const upcoming = buildUpcoming(snapshot)
      .filter((entry) => entry.petId === pet.id && entry.status !== 'completed')
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const concern = latestHealthConcern(snapshot, pet.id);
    const activeMeds = activeMedications(snapshot, pet.id);
    const overdueCount = buildUpcoming(snapshot).filter(
      (entry) => entry.petId === pet.id && (entry.status === 'overdue' || entry.status === 'expired')
    ).length;
    const missingVaccines = !snapshot.vaccineRecords.some((entry) => entry.petId === pet.id);
    const recentConcern = concern && isWithinLastDays(concern.loggedAt, 14) ? concern.summary : '';
    const careScore = Math.max(
      30,
      100 - overdueCount * 20 - (recentConcern ? 10 : 0) - (missingVaccines ? 10 : 0)
    );

    return {
      ...pet,
      latestWeightLabel: latest ? formatWeightLabel(latest.weight, latest.unit) : pet.weightLabel || 'Not recorded',
      careScore,
      statusSummary: overdueCount ? `${overdueCount} due item${overdueCount === 1 ? '' : 's'}` : 'On track',
      overdueCount,
      activeMedicationCount: activeMeds.length,
      recentConcern: recentConcern || 'No recent concern logged',
      nextDueLabel: upcoming ? `${upcoming.title} • ${upcoming.date}` : 'No upcoming care item',
      vaccineStatus: petVaccineStatus(snapshot.vaccineRecords, pet.id),
    };
  });
}

export function buildHealthAlerts(snapshot: AppSnapshot): DashboardAlert[] {
  return snapshot.pets.flatMap((pet) => {
    const alerts: DashboardAlert[] = [];
    const overdueItems = buildUpcoming(snapshot).filter(
      (entry) => entry.petId === pet.id && (entry.status === 'overdue' || entry.status === 'expired')
    );
    if (overdueItems.length) {
      alerts.push({
        id: `alert-overdue-${pet.id}`,
        petId: pet.id,
        petName: pet.name,
        title: 'Overdue care item',
        detail: overdueItems[0].title,
        status: 'warning',
      });
    }
    const concern = latestHealthConcern(snapshot, pet.id);
    if (concern && isWithinLastDays(concern.loggedAt, 7) && concern.symptoms) {
      alerts.push({
        id: `alert-health-${concern.id}`,
        petId: pet.id,
        petName: pet.name,
        title: 'Recent health concern',
        detail: concern.symptoms,
        status: 'info',
      });
    }
    return alerts;
  });
}

export function buildRecentActivity(snapshot: AppSnapshot) {
  return buildTimeline(snapshot).slice(0, 18);
}

export function buildPetOverview(snapshot: AppSnapshot, petId: string) {
  const latest = latestWeight(snapshot.weightLogs, petId);
  const nextAppt = nextAppointment(snapshot, petId);
  const meds = activeMedications(snapshot, petId);
  const concern = latestHealthConcern(snapshot, petId);
  const vaccines = snapshot.vaccineRecords.filter((entry) => entry.petId === petId);
  return {
    latestWeight: latest ? formatWeightLabel(latest.weight, latest.unit) : 'Not recorded',
    upcomingAppointment: nextAppt ? `${nextAppt.title} • ${nextAppt.scheduledAt}` : 'Nothing scheduled',
    activeMedicationCount: meds.length,
    nextMedicationDue: meds.length ? medicationEvent(snapshot, meds[0], snapshot.medicationDoses).date : '',
    recentHealthConcern: concern ? concern.summary : 'No recent health concerns',
    vaccineStatus: petVaccineStatus(vaccines, petId),
  };
}
