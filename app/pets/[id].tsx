import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Field } from '../../src/components/Field';
import { MetricCard } from '../../src/components/MetricCard';
import { OptionField } from '../../src/components/OptionField';
import { PetAvatar } from '../../src/components/PetAvatar';
import { Screen } from '../../src/components/Screen';
import { StatusBadge } from '../../src/components/StatusBadge';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { TimelineEventType } from '../../src/types/models';
import { formatDateTime, matchesSearch } from '../../src/utils/date';
import { palette, spacing } from '../../src/utils/theme';

const sections = ['Overview', 'Timeline', 'Health', 'Diet', 'Meds', 'Records'] as const;
const timelineTypes: Array<'all' | TimelineEventType> = ['all', 'health', 'feeding', 'dose', 'appointment', 'weight', 'record', 'vaccine'];

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, timeline, markMedicationDose, markAppointmentCompleted, getPetOverview } = usePetCare();
  const pet = snapshot.pets.find((entry) => entry.id === id);
  const [section, setSection] = useState<(typeof sections)[number]>('Overview');
  const [timelineFilter, setTimelineFilter] = useState<(typeof timelineTypes)[number]>('all');
  const [recordQuery, setRecordQuery] = useState('');

  const petTimeline = useMemo(
    () => timeline.filter((entry) => entry.petId === id && (timelineFilter === 'all' || entry.type === timelineFilter)),
    [id, timeline, timelineFilter]
  );

  const petHealth = useMemo(() => petTimeline.filter((entry) => entry.type === 'health'), [petTimeline]);
  const petDiet = useMemo(() => petTimeline.filter((entry) => entry.type === 'feeding'), [petTimeline]);
  const petMeds = useMemo(() => snapshot.medications.filter((entry) => entry.petId === id), [id, snapshot.medications]);
  const petWeights = useMemo(
    () => snapshot.weightLogs.filter((entry) => entry.petId === id).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [id, snapshot.weightLogs]
  );
  const petRecords = useMemo(
    () =>
      snapshot.recordItems.filter(
        (entry) =>
          entry.petId === id &&
          matchesSearch(recordQuery, entry.title, entry.kind, entry.provider, entry.notes)
      ),
    [id, recordQuery, snapshot.recordItems]
  );
  const petVaccines = useMemo(
    () =>
      snapshot.vaccineRecords.filter(
        (entry) =>
          entry.petId === id &&
          matchesSearch(recordQuery, entry.name, entry.provider, entry.notes, entry.lotNumber)
      ),
    [id, recordQuery, snapshot.vaccineRecords]
  );

  if (!pet) {
    return (
      <Screen>
        <EmptyState title="Pet not found" description="That profile is no longer available in local storage." />
      </Screen>
    );
  }

  const overview = getPetOverview(pet.id);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.header}>
            <PetAvatar name={pet.name} species={pet.species} photoUri={pet.photoUri} size={74} />
            <View style={styles.headerMeta}>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.meta}>
                {pet.species} • {pet.breed || 'Breed not set'}
              </Text>
              <Text style={styles.meta}>Preferred clinic: {pet.preferredVetClinic || pet.vetClinic || 'Not assigned'}</Text>
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
            <View style={styles.metricsGrid}>
              <MetricCard label="Latest weight" value={overview.latestWeight} />
              <MetricCard label="Upcoming appointment" value={overview.upcomingAppointment} />
              <MetricCard label="Active meds" value={`${overview.activeMedicationCount}`} hint={overview.nextMedicationDue ? `Next due ${formatDateTime(overview.nextMedicationDue)}` : 'No due dose'} />
              <MetricCard label="Recent concern" value={overview.recentHealthConcern} />
              <MetricCard label="Vaccine status" value={overview.vaccineStatus} />
            </View>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.line}>Birthday/Age: {pet.birthday || 'Not recorded'}</Text>
              <Text style={styles.line}>Current food: {pet.currentFood || 'Not recorded'}</Text>
              <Text style={styles.line}>Allergies: {pet.allergies || 'None recorded'}</Text>
              <Text style={styles.line}>Known conditions: {pet.knownConditions || 'None recorded'}</Text>
              <Text style={styles.line}>Microchip: {pet.microchipNumber || 'Not recorded'}</Text>
              <Text style={styles.line}>Emergency contact: {pet.emergencyContact || 'Not recorded'}</Text>
              <Text style={styles.line}>Insurance: {pet.insuranceProvider ? `${pet.insuranceProvider} (${pet.insurancePolicyNumber || 'No policy number'})` : 'Not recorded'}</Text>
              <Text style={styles.line}>Notes: {pet.notes || 'No notes yet'}</Text>
            </Card>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Weight History</Text>
              {petWeights.length ? (
                petWeights.map((entry) => (
                  <Text key={entry.id} style={styles.line}>
                    {entry.weight} {entry.unit} • {formatDateTime(entry.loggedAt)} • {entry.notes || 'No notes'}
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

        {section === 'Timeline' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Unified Timeline</Text>
            <OptionField
              label="Filter"
              value={timelineFilter}
              options={timelineTypes}
              optionLabels={{ all: 'All', dose: 'Meds', feeding: 'Diet' }}
              onChange={(value) => setTimelineFilter(value as (typeof timelineTypes)[number])}
            />
            {petTimeline.length ? (
              petTimeline.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineTitle}>{entry.title}</Text>
                    <StatusBadge label={entry.type} status={entry.status || 'upcoming'} />
                  </View>
                  <Text style={styles.meta}>{formatDateTime(entry.date)}</Text>
                  <Text style={styles.line}>{entry.subtitle}</Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
                  {entry.type === 'appointment' ? (
                    <Button label="Mark complete" size="small" variant="secondary" onPress={() => markAppointmentCompleted(entry.id)} />
                  ) : null}
                </View>
              ))
            ) : (
              <EmptyState title="No timeline events" description="Add health, diet, reminders, or vaccines to build a combined history." />
            )}
          </Card>
        ) : null}

        {section === 'Health' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Health Logs</Text>
            {petHealth.length ? (
              petHealth.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>{entry.title}</Text>
                  <Text style={styles.meta}>{formatDateTime(entry.date)}</Text>
                  <Text style={styles.line}>{entry.subtitle}</Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
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
                  <Text style={styles.timelineTitle}>{entry.title}</Text>
                  <Text style={styles.meta}>{formatDateTime(entry.date)}</Text>
                  <Text style={styles.line}>{entry.subtitle}</Text>
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
                    {entry.dosage} • {entry.scheduleType}
                  </Text>
                  <Text style={styles.line}>{entry.instructions || entry.customScheduleNotes || 'No notes'}</Text>
                  <View style={styles.actionsRow}>
                    <Button label="Mark dose given" size="small" onPress={() => markMedicationDose(entry.id, 'given')} />
                    <Button label="Skip dose" size="small" variant="secondary" onPress={() => markMedicationDose(entry.id, 'skipped')} />
                  </View>
                </View>
              ))
            ) : (
              <EmptyState title="No medications" description="Add medication schedules and mark doses as given or skipped." />
            )}
          </Card>
        ) : null}

        {section === 'Records' ? (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Records & Vaccines</Text>
            <Field label="Search records" value={recordQuery} onChangeText={setRecordQuery} placeholder="Rabies, insurance, lot number" />
            <Text style={styles.subsectionTitle}>Vaccines</Text>
            {petVaccines.length ? (
              petVaccines.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineTitle}>{entry.name}</Text>
                    <StatusBadge label={entry.expiresAt ? 'Tracked' : 'Current'} status={entry.expiresAt ? undefined : 'current'} />
                  </View>
                  <Text style={styles.meta}>{entry.provider || 'Provider not set'}</Text>
                  <Text style={styles.line}>Given: {entry.dateGiven || 'Unknown'} • Next due: {entry.expiresAt || 'Not set'}</Text>
                  <Text style={styles.line}>Lot: {entry.lotNumber || 'Not set'}</Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
                </View>
              ))
            ) : (
              <EmptyState title="No vaccines yet" description="Add vaccine records with due dates to track status." />
            )}
            <Text style={styles.subsectionTitle}>General records</Text>
            {petRecords.length ? (
              petRecords.map((entry) => (
                <View key={entry.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>{entry.title}</Text>
                  <Text style={styles.meta}>{entry.kind || 'General'} • {entry.provider || 'No provider'}</Text>
                  <Text style={styles.line}>Date: {entry.dateGiven || 'Unknown'} • Expires: {entry.expiresAt || 'n/a'}</Text>
                  <Text style={styles.line}>{entry.notes || 'No notes'}</Text>
                </View>
              ))
            ) : (
              <EmptyState title="No general records yet" description="Admin notes, insurance details, and manual records will show here." />
            )}
            <View style={styles.actionsRow}>
              <Link href={`/entries/record?petId=${pet.id}`} asChild>
                <Button label="Add record" size="small" variant="secondary" />
              </Link>
              <Link href={`/entries/vaccine?petId=${pet.id}`} asChild>
                <Button label="Add vaccine" size="small" variant="secondary" />
              </Link>
            </View>
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
    fontSize: 24,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionCard: {
    gap: 12,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  subsectionTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  line: {
    color: palette.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  timelineItem: {
    borderTopColor: palette.line,
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 12,
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  timelineTitle: {
    color: palette.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 8,
  },
});
