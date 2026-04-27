import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { demoData } from '../data/demoData';
import { buildDashboardPets, buildPastAppointments, buildRecentActivity, buildUpcoming } from '../features/dashboard/selectors';
import { AppSnapshot, AppointmentInput, FeedingLogInput, HealthLogInput, MedicationInput, PetInput, RecordInput, WeightInput } from '../types/models';
import { createAppointment, createFeedingLog, createHealthLog, createMedication, createPet, createRecordItem, createWeightLog, updatePetFromInput } from './petCareRepository';
import { STORAGE_KEY } from './storageKeys';

type PetCareContextValue = {
  snapshot: AppSnapshot;
  isHydrated: boolean;
  dashboard: {
    pets: ReturnType<typeof buildDashboardPets>;
    upcomingItems: ReturnType<typeof buildUpcoming>;
    pastAppointments: ReturnType<typeof buildPastAppointments>;
    recentActivity: ReturnType<typeof buildRecentActivity>;
  };
  upsertPet: (input: PetInput, petId?: string) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  addHealthLog: (petId: string, input: HealthLogInput) => Promise<void>;
  addFeedingLog: (petId: string, input: FeedingLogInput) => Promise<void>;
  addMedication: (petId: string, input: MedicationInput) => Promise<void>;
  addAppointment: (petId: string, input: AppointmentInput) => Promise<void>;
  addWeightLog: (petId: string, input: WeightInput) => Promise<void>;
  addRecordItem: (petId: string, input: RecordInput) => Promise<void>;
  markMedicationDoseGiven: (medicationId: string) => Promise<void>;
  restoreDemoData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  importData: (snapshot: AppSnapshot) => Promise<void>;
};

const defaultSnapshot: AppSnapshot = demoData;

const PetCareContext = createContext<PetCareContextValue | undefined>(undefined);

export function PetCareProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(defaultSnapshot);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSnapshot(JSON.parse(raw) as AppSnapshot);
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
      upcomingItems: buildUpcoming(snapshot),
      pastAppointments: buildPastAppointments(snapshot),
      recentActivity: buildRecentActivity(snapshot),
    }),
    [snapshot]
  );

  const value: PetCareContextValue = {
    snapshot,
    isHydrated,
    dashboard,
    upsertPet: async (input, petId) => {
      const next = petId
        ? { ...snapshot, pets: snapshot.pets.map((pet) => (pet.id === petId ? updatePetFromInput(pet, input) : pet)) }
        : { ...snapshot, pets: [createPet(input), ...snapshot.pets] };
      await persist(next);
    },
    deletePet: async (petId) => {
      const next: AppSnapshot = {
        pets: snapshot.pets.filter((pet) => pet.id !== petId),
        healthLogs: snapshot.healthLogs.filter((entry) => entry.petId !== petId),
        feedingLogs: snapshot.feedingLogs.filter((entry) => entry.petId !== petId),
        medications: snapshot.medications.filter((entry) => entry.petId !== petId),
        appointments: snapshot.appointments.filter((entry) => entry.petId !== petId),
        weightLogs: snapshot.weightLogs.filter((entry) => entry.petId !== petId),
        recordItems: snapshot.recordItems.filter((entry) => entry.petId !== petId),
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
      await persist({ ...snapshot, medications: [createMedication(petId, input), ...snapshot.medications] });
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
    markMedicationDoseGiven: async (medicationId) => {
      const next = {
        ...snapshot,
        medications: snapshot.medications.map((entry) =>
          entry.id === medicationId ? { ...entry, lastGivenAt: new Date().toISOString() } : entry
        ),
      };
      await persist(next);
    },
    restoreDemoData: async () => {
      await persist(demoData);
    },
    clearAllData: async () => {
      const empty: AppSnapshot = {
        pets: [],
        healthLogs: [],
        feedingLogs: [],
        medications: [],
        appointments: [],
        weightLogs: [],
        recordItems: [],
      };
      await persist(empty);
    },
    importData: async (next) => {
      await persist(next);
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
