import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Field, TextAreaField } from '../../src/components/Field';
import { OptionField } from '../../src/components/OptionField';
import { Screen } from '../../src/components/Screen';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { palette } from '../../src/utils/theme';

type EntryKind = 'health' | 'feeding' | 'medication' | 'appointment' | 'weight' | 'record';

const now = new Date().toISOString().slice(0, 16);

export default function EntryFormScreen() {
  const { kind, petId } = useLocalSearchParams<{ kind: EntryKind; petId?: string }>();
  const { snapshot, addHealthLog, addFeedingLog, addMedication, addAppointment, addWeightLog, addRecordItem } = usePetCare();
  const [selectedPetId, setSelectedPetId] = useState(petId ?? snapshot.pets[0]?.id ?? '');

  const [health, setHealth] = useState({
    loggedAt: now,
    symptoms: '',
    mood: 'Okay',
    energyLevel: 'Normal',
    stoolNotes: '',
    urineNotes: '',
    vomiting: '',
    coughing: '',
    itching: '',
    injuries: '',
    notes: '',
  });
  const [feeding, setFeeding] = useState({
    loggedAt: now,
    category: 'Meal',
    foodName: '',
    brand: '',
    quantity: '',
    waterIntake: '',
    notes: '',
  });
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequencyHours: '24',
    startDate: now.slice(0, 10),
    endDate: '',
    notes: '',
  });
  const [appointment, setAppointment] = useState({
    title: '',
    kind: 'Vet',
    scheduledAt: now,
    location: '',
    notes: '',
  });
  const [weight, setWeight] = useState({
    loggedAt: now,
    weight: '',
    unit: 'lb',
    notes: '',
  });
  const [record, setRecord] = useState({
    title: '',
    dateGiven: now.slice(0, 10),
    expiresAt: '',
    provider: '',
    notes: '',
  });

  const requirePet = () => {
    if (!selectedPetId) {
      Alert.alert('Required field', 'Please select a pet first.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!requirePet()) {
      return;
    }

    if (kind === 'health') {
      if (!health.symptoms.trim() && !health.notes.trim()) {
        Alert.alert('Required field', 'Add symptoms or notes for the health log.');
        return;
      }
      await addHealthLog(selectedPetId, health);
    }

    if (kind === 'feeding') {
      if (!feeding.foodName.trim()) {
        Alert.alert('Required field', 'Food name is required.');
        return;
      }
      await addFeedingLog(selectedPetId, feeding);
    }

    if (kind === 'medication') {
      if (!medication.name.trim() || !medication.dosage.trim()) {
        Alert.alert('Required field', 'Medication name and dosage are required.');
        return;
      }
      await addMedication(selectedPetId, medication);
    }

    if (kind === 'appointment') {
      if (!appointment.title.trim()) {
        Alert.alert('Required field', 'Appointment title is required.');
        return;
      }
      await addAppointment(selectedPetId, appointment);
    }

    if (kind === 'weight') {
      if (!weight.weight.trim()) {
        Alert.alert('Required field', 'Weight is required.');
        return;
      }
      await addWeightLog(selectedPetId, weight);
    }

    if (kind === 'record') {
      if (!record.title.trim()) {
        Alert.alert('Required field', 'Record title is required.');
        return;
      }
      await addRecordItem(selectedPetId, record);
    }

    router.back();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.heading}>New {kind}</Text>
          <OptionField
            label="Pet"
            value={selectedPetId}
            options={snapshot.pets.map((pet) => pet.id)}
            optionLabels={Object.fromEntries(snapshot.pets.map((pet) => [pet.id, pet.name]))}
            onChange={setSelectedPetId}
          />

          {kind === 'health' ? (
            <>
              <Field label="Date/time" value={health.loggedAt} onChangeText={(value) => setHealth((current) => ({ ...current, loggedAt: value }))} placeholder="2026-04-27T09:30" />
              <Field label="Symptoms" value={health.symptoms} onChangeText={(value) => setHealth((current) => ({ ...current, symptoms: value }))} placeholder="Sneezing, reduced appetite" />
              <OptionField label="Mood" value={health.mood} options={['Happy', 'Okay', 'Anxious', 'Low']} onChange={(value) => setHealth((current) => ({ ...current, mood: value }))} />
              <OptionField label="Energy" value={health.energyLevel} options={['High', 'Normal', 'Low']} onChange={(value) => setHealth((current) => ({ ...current, energyLevel: value }))} />
              <Field label="Stool notes" value={health.stoolNotes} onChangeText={(value) => setHealth((current) => ({ ...current, stoolNotes: value }))} placeholder="Normal, soft, diarrhea" />
              <Field label="Urine notes" value={health.urineNotes} onChangeText={(value) => setHealth((current) => ({ ...current, urineNotes: value }))} placeholder="Normal output" />
              <Field label="Vomiting" value={health.vomiting} onChangeText={(value) => setHealth((current) => ({ ...current, vomiting: value }))} placeholder="None / once / frequent" />
              <Field label="Coughing" value={health.coughing} onChangeText={(value) => setHealth((current) => ({ ...current, coughing: value }))} placeholder="Dry cough in morning" />
              <Field label="Itching" value={health.itching} onChangeText={(value) => setHealth((current) => ({ ...current, itching: value }))} placeholder="Mild ear scratching" />
              <Field label="Injuries" value={health.injuries} onChangeText={(value) => setHealth((current) => ({ ...current, injuries: value }))} placeholder="Minor paw scrape" />
              <TextAreaField label="Notes" value={health.notes} onChangeText={(value) => setHealth((current) => ({ ...current, notes: value }))} placeholder="Observed after morning walk" />
            </>
          ) : null}

          {kind === 'feeding' ? (
            <>
              <Field label="Feeding time" value={feeding.loggedAt} onChangeText={(value) => setFeeding((current) => ({ ...current, loggedAt: value }))} placeholder="2026-04-27T07:00" />
              <OptionField label="Type" value={feeding.category} options={['Meal', 'Treat', 'Supplement']} onChange={(value) => setFeeding((current) => ({ ...current, category: value }))} />
              <Field label="Food name *" value={feeding.foodName} onChangeText={(value) => setFeeding((current) => ({ ...current, foodName: value }))} placeholder="Chicken kibble" />
              <Field label="Brand/type" value={feeding.brand} onChangeText={(value) => setFeeding((current) => ({ ...current, brand: value }))} placeholder="Purina Pro Plan" />
              <Field label="Quantity" value={feeding.quantity} onChangeText={(value) => setFeeding((current) => ({ ...current, quantity: value }))} placeholder="1.5 cups" />
              <Field label="Water intake" value={feeding.waterIntake} onChangeText={(value) => setFeeding((current) => ({ ...current, waterIntake: value }))} placeholder="250 ml" />
              <TextAreaField label="Notes" value={feeding.notes} onChangeText={(value) => setFeeding((current) => ({ ...current, notes: value }))} placeholder="Ate slowly, added supplement topper" />
            </>
          ) : null}

          {kind === 'medication' ? (
            <>
              <Field label="Medication name *" value={medication.name} onChangeText={(value) => setMedication((current) => ({ ...current, name: value }))} placeholder="Carprofen" />
              <Field label="Dosage *" value={medication.dosage} onChangeText={(value) => setMedication((current) => ({ ...current, dosage: value }))} placeholder="25 mg" />
              <Field label="Frequency hours" value={medication.frequencyHours} onChangeText={(value) => setMedication((current) => ({ ...current, frequencyHours: value }))} keyboardType="numeric" placeholder="24" />
              <Field label="Start date" value={medication.startDate} onChangeText={(value) => setMedication((current) => ({ ...current, startDate: value }))} placeholder="2026-04-27" />
              <Field label="End date" value={medication.endDate} onChangeText={(value) => setMedication((current) => ({ ...current, endDate: value }))} placeholder="2026-05-11" />
              <TextAreaField label="Notes" value={medication.notes} onChangeText={(value) => setMedication((current) => ({ ...current, notes: value }))} placeholder="Give with food" />
            </>
          ) : null}

          {kind === 'appointment' ? (
            <>
              <Field label="Title *" value={appointment.title} onChangeText={(value) => setAppointment((current) => ({ ...current, title: value }))} placeholder="Annual vaccine visit" />
              <OptionField label="Type" value={appointment.kind} options={['Vet', 'Grooming', 'Vaccine', 'Medication', 'Flea/Tick', 'Heartworm', 'Custom']} onChange={(value) => setAppointment((current) => ({ ...current, kind: value }))} />
              <Field label="Date/time" value={appointment.scheduledAt} onChangeText={(value) => setAppointment((current) => ({ ...current, scheduledAt: value }))} placeholder="2026-05-03T14:00" />
              <Field label="Location" value={appointment.location} onChangeText={(value) => setAppointment((current) => ({ ...current, location: value }))} placeholder="Maple Grove Vet" />
              <TextAreaField label="Notes" value={appointment.notes} onChangeText={(value) => setAppointment((current) => ({ ...current, notes: value }))} placeholder="Bring stool sample and vaccine records" />
            </>
          ) : null}

          {kind === 'weight' ? (
            <>
              <Field label="Date/time" value={weight.loggedAt} onChangeText={(value) => setWeight((current) => ({ ...current, loggedAt: value }))} placeholder="2026-04-27T08:00" />
              <Field label="Weight *" value={weight.weight} onChangeText={(value) => setWeight((current) => ({ ...current, weight: value }))} keyboardType="numeric" placeholder="52.4" />
              <OptionField label="Unit" value={weight.unit} options={['lb', 'kg']} onChange={(value) => setWeight((current) => ({ ...current, unit: value }))} />
              <TextAreaField label="Notes" value={weight.notes} onChangeText={(value) => setWeight((current) => ({ ...current, notes: value }))} placeholder="Taken after breakfast" />
            </>
          ) : null}

          {kind === 'record' ? (
            <>
              <Field label="Record name *" value={record.title} onChangeText={(value) => setRecord((current) => ({ ...current, title: value }))} placeholder="Rabies vaccine" />
              <Field label="Date given" value={record.dateGiven} onChangeText={(value) => setRecord((current) => ({ ...current, dateGiven: value }))} placeholder="2026-04-27" />
              <Field label="Expiration date" value={record.expiresAt} onChangeText={(value) => setRecord((current) => ({ ...current, expiresAt: value }))} placeholder="2027-04-27" />
              <Field label="Vet or provider" value={record.provider} onChangeText={(value) => setRecord((current) => ({ ...current, provider: value }))} placeholder="Maple Grove Vet" />
              <TextAreaField label="Notes" value={record.notes} onChangeText={(value) => setRecord((current) => ({ ...current, notes: value }))} placeholder="Lot number or certificate notes" />
            </>
          ) : null}

          <View style={styles.actions}>
            <Button label="Save entry" onPress={handleSave} />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  card: {
    gap: 14,
  },
  heading: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actions: {
    marginTop: 6,
  },
});
