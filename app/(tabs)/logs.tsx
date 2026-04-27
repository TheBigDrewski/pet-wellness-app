import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Field } from '../../src/components/Field';
import { OptionField } from '../../src/components/OptionField';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatusBadge } from '../../src/components/StatusBadge';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { TimelineEventType } from '../../src/types/models';
import { formatDateTime, matchesSearch } from '../../src/utils/date';
import { palette, radii, spacing } from '../../src/utils/theme';

const typeOptions: Array<'all' | TimelineEventType> = ['all', 'health', 'feeding', 'dose', 'appointment', 'weight', 'record', 'vaccine'];
const rangeOptions = ['all', '7', '30', '90'] as const;

export default function LogsScreen() {
  const { timeline, snapshot } = usePetCare();
  const [query, setQuery] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('all');
  const [selectedType, setSelectedType] = useState<(typeof typeOptions)[number]>('all');
  const [selectedRange, setSelectedRange] = useState<(typeof rangeOptions)[number]>('30');

  const filtered = useMemo(() => {
    const minimumDate =
      selectedRange === 'all' ? 0 : Date.now() - Number(selectedRange) * 24 * 60 * 60 * 1000;

    return timeline.filter((entry) => {
      const matchesPet = selectedPetId === 'all' || entry.petId === selectedPetId;
      const matchesType = selectedType === 'all' || entry.type === selectedType;
      const matchesDate = selectedRange === 'all' || new Date(entry.date).getTime() >= minimumDate;
      const matchesText = matchesSearch(query, entry.title, entry.subtitle, entry.notes, entry.petName);
      return matchesPet && matchesType && matchesDate && matchesText;
    });
  }, [minimumDateHack(selectedRange), query, selectedPetId, selectedRange, selectedType, timeline]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title="Logs & Timeline"
          subtitle="Search and filter recent pet care activity"
          actionLabel="Add health log"
          href="/entries/health"
        />
        <View style={styles.quickRow}>
          <Link href="/entries/feeding" style={styles.quickLink}>
            Meal
          </Link>
          <Link href="/entries/weight" style={styles.quickLink}>
            Weight
          </Link>
          <Link href="/entries/record" style={styles.quickLink}>
            Record
          </Link>
          <Link href="/entries/vaccine" style={styles.quickLink}>
            Vaccine
          </Link>
        </View>

        <Card style={styles.filters}>
          <Field label="Search" value={query} onChangeText={setQuery} placeholder="Symptoms, meds, vaccines, notes" />
          <OptionField
            label="Pet"
            value={selectedPetId}
            options={['all', ...snapshot.pets.map((pet) => pet.id)]}
            optionLabels={{ all: 'All pets', ...Object.fromEntries(snapshot.pets.map((pet) => [pet.id, pet.name])) }}
            onChange={setSelectedPetId}
          />
          <OptionField
            label="Type"
            value={selectedType}
            options={typeOptions}
            optionLabels={{ all: 'All types', dose: 'Meds', feeding: 'Diet' }}
            onChange={(value) => setSelectedType(value as (typeof typeOptions)[number])}
          />
          <OptionField
            label="Date range"
            value={selectedRange}
            options={rangeOptions as unknown as string[]}
            optionLabels={{ all: 'All time', '7': '7 days', '30': '30 days', '90': '90 days' }}
            onChange={(value) => setSelectedRange(value as (typeof rangeOptions)[number])}
          />
        </Card>

        {filtered.length ? (
          filtered.map((entry) => (
            <Card key={entry.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.title}>{entry.title}</Text>
                <StatusBadge label={entry.type} status={entry.status || 'upcoming'} />
              </View>
              <Text style={styles.meta}>
                {entry.petName} • {formatDateTime(entry.date)}
              </Text>
              <Text style={styles.body}>{entry.subtitle}</Text>
              <Text style={styles.notes}>{entry.notes || 'No extra notes'}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No matching logs"
            description="Try broadening the filters or log a new health, diet, medication, or record event."
          />
        )}
      </ScrollView>
    </Screen>
  );
}

function minimumDateHack(value: (typeof rangeOptions)[number]) {
  return value;
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: 24,
  },
  filters: {
    gap: spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickLink: {
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.line,
    borderRadius: radii.pill,
    borderWidth: 1,
    color: palette.accent,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  card: {
    gap: spacing.xs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  title: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
  },
  body: {
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  notes: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
