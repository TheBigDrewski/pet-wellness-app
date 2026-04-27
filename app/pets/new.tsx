import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Field, TextAreaField } from '../../src/components/Field';
import { OptionField } from '../../src/components/OptionField';
import { PetAvatar } from '../../src/components/PetAvatar';
import { Screen } from '../../src/components/Screen';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { PetInput } from '../../src/types/models';
import { palette, spacing } from '../../src/utils/theme';

const emptyPet: PetInput = {
  name: '',
  species: 'Dog',
  breed: '',
  sex: '',
  birthday: '',
  weightLabel: '',
  colorMarkings: '',
  microchipNumber: '',
  vetName: '',
  vetPhone: '',
  vetClinic: '',
  preferredVetClinic: '',
  photoUri: '',
  allergies: '',
  knownConditions: '',
  currentFood: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  emergencyContact: '',
  notes: '',
};

export default function PetFormScreen() {
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const { snapshot, upsertPet, deletePet } = usePetCare();
  const existingPet = useMemo(() => snapshot.pets.find((pet) => pet.id === petId), [petId, snapshot.pets]);
  const [form, setForm] = useState<PetInput>(emptyPet);

  useEffect(() => {
    if (existingPet) {
      setForm({
        name: existingPet.name,
        species: existingPet.species,
        breed: existingPet.breed,
        sex: existingPet.sex,
        birthday: existingPet.birthday,
        weightLabel: existingPet.weightLabel,
        colorMarkings: existingPet.colorMarkings,
        microchipNumber: existingPet.microchipNumber,
        vetName: existingPet.vetName,
        vetPhone: existingPet.vetPhone,
        vetClinic: existingPet.vetClinic,
        preferredVetClinic: existingPet.preferredVetClinic,
        photoUri: existingPet.photoUri,
        allergies: existingPet.allergies,
        knownConditions: existingPet.knownConditions,
        currentFood: existingPet.currentFood,
        insuranceProvider: existingPet.insuranceProvider,
        insurancePolicyNumber: existingPet.insurancePolicyNumber,
        emergencyContact: existingPet.emergencyContact,
        notes: existingPet.notes,
      });
    }
  }, [existingPet]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Required field', 'Pet name is required.');
      return;
    }
    await upsertPet(form, petId);
    router.back();
  };

  const handleDelete = async () => {
    if (!petId) {
      return;
    }
    await deletePet(petId);
    router.replace('/(tabs)/pets');
  };

  const handlePickPhoto = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true });
    if (result.canceled || !result.assets.length) {
      return;
    }
    setForm((current) => ({ ...current, photoUri: result.assets[0].uri }));
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.heading}>{petId ? 'Edit pet profile' : 'Add a new pet'}</Text>
          <View style={styles.avatarRow}>
            <PetAvatar name={form.name || 'Pet'} species={form.species} photoUri={form.photoUri} size={84} />
            <View style={styles.avatarActions}>
              <Button label="Choose photo" variant="secondary" size="small" onPress={handlePickPhoto} />
              {form.photoUri ? <Button label="Remove photo" variant="secondary" size="small" onPress={() => setForm((current) => ({ ...current, photoUri: '' }))} /> : null}
            </View>
          </View>

          <Field label="Name *" value={form.name} onChangeText={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="Luna" />
          <OptionField
            label="Species"
            value={form.species}
            options={['Dog', 'Cat', 'Rabbit', 'Bird', 'Reptile', 'Other']}
            onChange={(value) => setForm((current) => ({ ...current, species: value }))}
          />
          <Field label="Breed" value={form.breed} onChangeText={(value) => setForm((current) => ({ ...current, breed: value }))} placeholder="Golden Retriever" />
          <OptionField
            label="Sex"
            value={form.sex}
            options={['Female', 'Male', 'Unknown']}
            onChange={(value) => setForm((current) => ({ ...current, sex: value }))}
          />
          <Field
            label="Birthday or age"
            value={form.birthday}
            onChangeText={(value) => setForm((current) => ({ ...current, birthday: value }))}
            placeholder="2021-06-14 or 4 years old"
          />
          <Field
            label="Weight"
            value={form.weightLabel}
            onChangeText={(value) => setForm((current) => ({ ...current, weightLabel: value }))}
            placeholder="52 lb"
          />
          <Field
            label="Color or markings"
            value={form.colorMarkings}
            onChangeText={(value) => setForm((current) => ({ ...current, colorMarkings: value }))}
            placeholder="Golden coat with white chest"
          />
          <Field
            label="Current food"
            value={form.currentFood}
            onChangeText={(value) => setForm((current) => ({ ...current, currentFood: value }))}
            placeholder="Purina Pro Plan Sensitive Skin & Stomach"
          />
          <TextAreaField
            label="Allergies"
            value={form.allergies}
            onChangeText={(value) => setForm((current) => ({ ...current, allergies: value }))}
            placeholder="Chicken sensitivity, seasonal pollen"
          />
          <TextAreaField
            label="Known conditions"
            value={form.knownConditions}
            onChangeText={(value) => setForm((current) => ({ ...current, knownConditions: value }))}
            placeholder="Hip dysplasia, anxiety, mild GI sensitivity"
          />
          <Field
            label="Microchip number"
            value={form.microchipNumber}
            onChangeText={(value) => setForm((current) => ({ ...current, microchipNumber: value }))}
            placeholder="982000411234567"
          />
          <Field
            label="Primary vet"
            value={form.vetName}
            onChangeText={(value) => setForm((current) => ({ ...current, vetName: value }))}
            placeholder="Dr. Kim"
          />
          <Field
            label="Preferred clinic"
            value={form.preferredVetClinic}
            onChangeText={(value) => setForm((current) => ({ ...current, preferredVetClinic: value }))}
            placeholder="Maple Grove Vet"
          />
          <Field
            label="Vet clinic"
            value={form.vetClinic}
            onChangeText={(value) => setForm((current) => ({ ...current, vetClinic: value }))}
            placeholder="Maple Grove Vet"
          />
          <Field
            label="Vet phone"
            value={form.vetPhone}
            onChangeText={(value) => setForm((current) => ({ ...current, vetPhone: value }))}
            placeholder="555-0123"
            keyboardType="phone-pad"
          />
          <Field
            label="Insurance provider"
            value={form.insuranceProvider}
            onChangeText={(value) => setForm((current) => ({ ...current, insuranceProvider: value }))}
            placeholder="Trupanion"
          />
          <Field
            label="Policy number"
            value={form.insurancePolicyNumber}
            onChangeText={(value) => setForm((current) => ({ ...current, insurancePolicyNumber: value }))}
            placeholder="TP-20491-LUNA"
          />
          <Field
            label="Emergency contact"
            value={form.emergencyContact}
            onChangeText={(value) => setForm((current) => ({ ...current, emergencyContact: value }))}
            placeholder="Chris - 555-0222"
          />
          <TextAreaField
            label="Notes"
            value={form.notes}
            onChangeText={(value) => setForm((current) => ({ ...current, notes: value }))}
            placeholder="Temperament, medication tips, emergency instructions"
          />
          <View style={styles.actions}>
            <Button label="Save pet" onPress={handleSave} />
            {petId ? <Button label="Delete pet" variant="danger" onPress={handleDelete} /> : null}
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
  },
  avatarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatarActions: {
    flex: 1,
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
});
