import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { PetAvatar } from '../../src/components/PetAvatar';
import { Screen } from '../../src/components/Screen';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { formatDateTime } from '../../src/utils/date';
import { palette } from '../../src/utils/theme';

const sections = ['Overview', 'Health', 'Diet', 'Meds', 'Records'] as const;

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, dashboard, markMedicationDoseGiven } = usePetCare();
  const pet = snapshot.pets.find((entry) => entry.id === id);
  const [section, setSection] = useState<(typeof sections)[number]>('Overview');

  const petHealth = useMemo(
    () => snapshot.healthLogs.filter((entry) => entry.petId === id).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [id, snapshot.healthLogs]
  );
  const petDiet = useMemo(
    () => snapshot.feedingLogs.filter((entry) => entry.petId === id).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [id, snapshot.feedingLogs]
  );
  const petMeds = useMemo(
    () => snapshot.medications.filter((entry) => entry.petId === id).sort((a, b) => a.name.localeCompare(b.name)),
    [id, snapshot.medications]
  );
  const petRecords = useMemo(
    () => snapshot.recordItems.filter((entry) => entry.petId === id).sort((a, b) => b.dateGiven.localeCompare(a.dateGiven)),
    [id, snapshot.recordItems]
  );
  const petWeights = useMemo(
    () => snapshot.weightLogs.filter((entry) => entry.petId === id).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [id, snapshot.weightLogs]
  );

  if (!pet) {
    return (
      <Screen>
        <EmptyState title="Pet not found" description="That profile is no longer available in local storage." />
      </Screen>
    );
  }

  const latestWeight = petWeights[0]?.weight;
  const petSummary = dashboard.pets.find((entry) => entry.id === id);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.header}>
            <PetAvatar name={pet.name} species={pet.species} size={64} />
            <View style={styles.headerMeta}>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.meta}>
                {pet.species} • {pet.breed || 'Breed not set'}
              </Text>
              <Text style={styles.meta}>Vet: {pet.vetName || 'Not assigned'}</Text>
            </View>
          </View>
          <View style={styles.quickActions}>
            <Link href={`/entries/health?petId=${pet.id}`} asChild>
              <Button label="Log health" size="small" />
            </Link>
            <Link href={`/entries/feeding?petId=${pet.id}`} asChild>
              <Button label="Log meal" size="small" variant="secondary" />
            </Link>
            <Link href={`/entries/appointment?petId=${pet.id}`} asChild>
              <Button label="Add reminder" size="small" variant="secondary" />
            </Link>
            <Link href={`/pets/new?petId=${pet.id}`} asChild>
              <Button label="Edit profile" size="small" variant="secondary" />
            </Link>
          </View>
        </Card>

        <View style={styles.tabRow}>
          {sections.map((item) => (
            <Button
              key={item}
              label={item}
              size="small"
              variant={section === item ? 'primary' : 'secondary'}
              onPress={() => setSection(item)}
            />
          ))}
        </View>

        {section === 'Overview' ? (
          <>
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.line}>Birthday/Age: {pet.birthday || 'Not recorded'}</Text>
              <Text style={styles.line}>Current weight: {latestWeight ? `${latestWeight} ${petWeights[0]?.unit}` : pet.weightLabel || 'Not recorded'}</Text>
              <Text style={styles.line}>Color/markings: {pet.colorMarkings || 'Not recorded'}</Text>
              <Text style={styles.line}>Microchip: {pet.microchipNumber || 'Not recorded'}</Text>
              <Text style={styles.line}>Vet clinic: {pet.vetClinic || 'Not recorded'}</Text>
              <Text style={styles.line}>Notes: {pet.notes || 'No notes yet'}</Text>
            </Card>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Weight History</Text>
              {petWeights.length ? (
                petWeights.map((entry) => (
                  <Text key={entry.id} style={styles.line}>
                    {entry.weight} {entry.unit} • {formatDateTime(entry.loggedAt)}
                  </Text>
                ))
              ) : (
                <EmptyState title="No weight logs" description="Add a weight entry to start tracking trends." />
              )}
              <Link href={`/entries/weight?petId=${pet.id}`} asChild>
                <Button label="Add weight" size="small" variant="secondary" />
              </Link>
            </Card>
          </>
        ) : null}

        {section === 'Health' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Health Timeline</Text>
            {petHealth.length ? (
              petHealth.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>{entry.mood} • {entry.energyLevel}</Text>
                  <Text style={styles.meta}>{formatDateTime(entry.loggedAt)}</Text>
                  <Text style={styles.line}>{entry.summary}</Text>
                </View>
              ))
            ) : (
              <EmptyState title="No health logs" description="Symptoms, energy, and daily observations will appear here." />
            )}
          </Card>
        ) : null}

        {section === 'Diet' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Diet & Feeding</Text>
            {petDiet.length ? (
              petDiet.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>{entry.category} • {entry.foodName}</Text>
                  <Text style={styles.meta}>{formatDateTime(entry.loggedAt)}</Text>
                  <Text style={styles.line}>
                    {entry.quantity || 'Quantity not recorded'} • Water: {entry.waterIntake || 'n/a'}
                  </Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
                </View>
              ))
            ) : (
              <EmptyState title="No feeding logs" description="Meals, treats, and supplement entries will show here." />
            )}
          </Card>
        ) : null}

        {section === 'Meds' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Medications</Text>
            {petMeds.length ? (
              petMeds.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>{entry.name}</Text>
                  <Text style={styles.meta}>
                    {entry.dosage} • every {entry.frequencyHours}h
                  </Text>
                  <Text style={styles.line}>
                    Last given: {entry.lastGivenAt ? formatDateTime(entry.lastGivenAt) : 'Not marked yet'}
                  </Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
                  <Button label="Mark dose given" size="small" variant="secondary" onPress={() => markMedicationDoseGiven(entry.id)} />
                </View>
              ))
            ) : (
              <EmptyState title="No medications" description="Add medication schedules and mark doses as given." />
            )}
          </Card>
        ) : null}

        {section === 'Records' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Records</Text>
            {petRecords.length ? (
              petRecords.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>{entry.title}</Text>
                  <Text style={styles.meta}>
                    {entry.provider || 'Provider not set'} • {entry.dateGiven}
                  </Text>
                  <Text style={styles.line}>Expires: {entry.expiresAt || 'n/a'}</Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
                </View>
              ))
            ) : (
              <EmptyState title="No records yet" description="Vaccines and manual record entries will be listed here." />
            )}
            <Link href={`/entries/record?petId=${pet.id}`} asChild>
              <Button label="Add record" size="small" variant="secondary" />
            </Link>
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 24,
  },
  hero: {
    gap: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  headerMeta: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionCard: {
    gap: 12,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  line: {
    color: palette.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  timelineItem: {
    borderTopColor: '#f0e4d8',
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 12,
  },
  timelineTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '700',
  },
});
