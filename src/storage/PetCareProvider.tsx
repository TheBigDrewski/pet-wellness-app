import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import {
  buildDashboardPets,
  buildHealthAlerts,
  buildPetOverview,
  buildRecentActivity,
  buildTimeline,
  buildUpcoming,
} from '../features/dashboard/selectors';
import { demoData } from '../data/demoData';
import {
  AppSnapshot,
  AppointmentInput,
  FeedingLogInput,
  HealthLogInput,
  MedicationDoseStatus,
  MedicationInput,
  PetInput,
  RecordInput,
  VaccineInput,
  WeightInput,
} from '../types/models';
import {
  createAppointment,
  createFeedingLog,
  createHealthLog,
  createMedication,
  createMedicationDose,
  createPet,
  createRecordItem,
  createVaccineRecord,
  createWeightLog,
  nextDoseAt,
  updatePetFromInput,
} from './petCareRepository';
import { emptySnapshot, normalizeSnapshot } from './normalizeSnapshot';
import { STORAGE_KEY } from './storageKeys';

type PetCareContextValue = {
  snapshot: AppSnapshot;
  isHydrated: boolean;
  dashboard: {
    pets: ReturnType<typeof buildDashboardPets>;
    healthAlerts: ReturnType<typeof buildHealthAlerts>;
    upcomingItems: ReturnType<typeof buildUpcoming>;
    recentActivity: ReturnType<typeof buildRecentActivity>;
  };
  timeline: ReturnType<typeof buildTimeline>;
  getPetOverview: (petId: string) => ReturnType<typeof buildPetOverview>;
  upsertPet: (input: PetInput, petId?: string) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  addHealthLog: (petId: string, input: HealthLogInput) => Promise<void>;
  addFeedingLog: (petId: string, input: FeedingLogInput) => Promise<void>;
  addMedication: (petId: string, input: MedicationInput) => Promise<void>;
  addAppointment: (petId: string, input: AppointmentInput) => Promise<void>;
  addWeightLog: (petId: string, input: WeightInput) => Promise<void>;
  addRecordItem: (petId: string, input: RecordInput) => Promise<void>;
  addVaccineRecord: (petId: string, input: VaccineInput) => Promise<void>;
  markMedicationDose: (medicationId: string, status: MedicationDoseStatus, scheduledFor?: string) => Promise<void>;
  markAppointmentCompleted: (appointmentId: string) => Promise<void>;
  restoreDemoData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  importData: (snapshot: unknown) => Promise<void>;
};

const PetCareContext = createContext<PetCareContextValue | undefined>(undefined);

export function PetCareProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(demoData);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSnapshot(normalizeSnapshot(JSON.parse(raw)));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
          setSnapshot(demoData);
        }
      } catch {
        Alert.alert('Storage error', 'Unable to load local data. Demo data has been restored.');
        setSnapshot(demoData);
      } finally {
        setHydrated(true);
      }
    };

    void load();
  }, []);

  const persist = async (next: AppSnapshot) => {
    setSnapshot(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const dashboard = useMemo(
    () => ({
      pets: buildDashboardPets(snapshot),
      healthAlerts: buildHealthAlerts(snapshot),
      upcomingItems: buildUpcoming(snapshot),
      recentActivity: buildRecentActivity(snapshot),
    }),
    [snapshot]
  );

  const timeline = useMemo(() => buildTimeline(snapshot), [snapshot]);

  const value: PetCareContextValue = {
    snapshot,
    isHydrated,
    dashboard,
    timeline,
    getPetOverview: (petId) => buildPetOverview(snapshot, petId),
    upsertPet: async (input, petId) => {
      const next = petId
        ? { ...snapshot, pets: snapshot.pets.map((pet) => (pet.id === petId ? updatePetFromInput(pet, input) : pet)) }
        : { ...snapshot, pets: [createPet(input), ...snapshot.pets] };
      await persist(next);
    },
    deletePet: async (petId) => {
      const next: AppSnapshot = {
        ...snapshot,
        pets: snapshot.pets.filter((pet) => pet.id !== petId),
        healthLogs: snapshot.healthLogs.filter((entry) => entry.petId !== petId),
        feedingLogs: snapshot.feedingLogs.filter((entry) => entry.petId !== petId),
        medications: snapshot.medications.filter((entry) => entry.petId !== petId),
        medicationDoses: snapshot.medicationDoses.filter((entry) => entry.petId !== petId),
        appointments: snapshot.appointments.filter((entry) => entry.petId !== petId),
        weightLogs: snapshot.weightLogs.filter((entry) => entry.petId !== petId),
        recordItems: snapshot.recordItems.filter((entry) => entry.petId !== petId),
        vaccineRecords: snapshot.vaccineRecords.filter((entry) => entry.petId !== petId),
      };
      await persist(next);
    },
    addHealthLog: async (petId, input) => {
      await persist({ ...snapshot, healthLogs: [createHealthLog(petId, input), ...snapshot.healthLogs] });
    },
    addFeedingLog: async (petId, input) => {
      await persist({ ...snapshot, feedingLogs: [createFeedingLog(petId, input), ...snapshot.feedingLogs] });
    },
    addMedication: async (petId, input) => {
      const medication = createMedication(petId, input);
      await persist({ ...snapshot, medications: [medication, ...snapshot.medications] });
    },
    addAppointment: async (petId, input) => {
      await persist({ ...snapshot, appointments: [createAppointment(petId, input), ...snapshot.appointments] });
    },
    addWeightLog: async (petId, input) => {
      await persist({ ...snapshot, weightLogs: [createWeightLog(petId, input), ...snapshot.weightLogs] });
    },
    addRecordItem: async (petId, input) => {
      await persist({ ...snapshot, recordItems: [createRecordItem(petId, input), ...snapshot.recordItems] });
    },
    addVaccineRecord: async (petId, input) => {
      await persist({ ...snapshot, vaccineRecords: [createVaccineRecord(petId, input), ...snapshot.vaccineRecords] });
    },
    markMedicationDose: async (medicationId, status, scheduledFor) => {
      const medication = snapshot.medications.find((entry) => entry.id === medicationId);
      if (!medication) {
        return;
      }
      const nextDose = scheduledFor || nextDoseAt(medication, snapshot.medicationDoses);
      const dose = createMedicationDose(medication, status, nextDose);
      await persist({ ...snapshot, medicationDoses: [dose, ...snapshot.medicationDoses] });
    },
    markAppointmentCompleted: async (appointmentId) => {
      const next = {
        ...snapshot,
        appointments: snapshot.appointments.map((entry) =>
          entry.id === appointmentId ? { ...entry, completedAt: new Date().toISOString() } : entry
        ),
      };
      await persist(next);
    },
    restoreDemoData: async () => {
      await persist(demoData);
    },
    clearAllData: async () => {
      await persist(emptySnapshot());
    },
    importData: async (next) => {
      await persist(normalizeSnapshot(next));
    },
  };

  return <PetCareContext.Provider value={value}>{children}</PetCareContext.Provider>;
}

export function usePetCare() {
  const context = useContext(PetCareContext);
  if (!context) {
    throw new Error('usePetCare must be used inside PetCareProvider');
  }
  return context;
}
