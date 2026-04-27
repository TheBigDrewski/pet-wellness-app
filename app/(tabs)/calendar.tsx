import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatusBadge } from '../../src/components/StatusBadge';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { UpcomingItem } from '../../src/types/models';
import { formatDateTime } from '../../src/utils/date';
import { palette, spacing } from '../../src/utils/theme';

const groups: UpcomingItem['group'][] = ['Today', 'This week', 'Later', 'Past'];

export default function CalendarScreen() {
  const { dashboard, snapshot, markAppointmentCompleted, markMedicationDose } = usePetCare();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title="Upcoming Care"
          subtitle="Grouped reminders, appointments, doses, and vaccine due dates"
          actionLabel="Add event"
          href="/entries/appointment"
        />

        {dashboard.upcomingItems.length ? (
          groups.map((group) => {
            const items = dashboard.upcomingItems.filter((entry) => entry.group === group);
            if (!items.length) {
              return null;
            }

            return (
              <View key={group} style={styles.group}>
                <Text style={styles.groupTitle}>{group}</Text>
                {items.map((item) => {
                  const medication = snapshot.medications.find((entry) => `med-${entry.id}` === item.id);
                  return (
                    <Card key={item.id} style={styles.card}>
                      <View style={styles.row}>
                        <Text style={styles.title}>{item.title}</Text>
                        <StatusBadge label={item.status || 'Upcoming'} status={item.status} />
                      </View>
                      <Text style={styles.meta}>
                        {item.petName} • {formatDateTime(item.date)}
                      </Text>
                      <Text style={styles.body}>{item.subtitle}</Text>
                      <Text style={styles.notes}>{item.notes || 'No notes'}</Text>
                      <View style={styles.actions}>
                        {item.type === 'appointment' ? (
                          <Button label="Mark complete" size="small" variant="secondary" onPress={() => markAppointmentCompleted(item.id.replace('upcoming-', ''))} />
                        ) : null}
                        {item.type === 'dose' && medication ? (
                          <>
                            <Button label="Given" size="small" onPress={() => markMedicationDose(medication.id, 'given', item.date)} />
                            <Button label="Skipped" size="small" variant="secondary" onPress={() => markMedicationDose(medication.id, 'skipped', item.date)} />
                          </>
                        ) : null}
                      </View>
                    </Card>
                  );
                })}
              </View>
            );
          })
        ) : (
          <EmptyState title="No upcoming items" description="Appointments, dose reminders, and vaccine due dates will show up here." />
        )}

        <SectionHeader title="Quick Add" subtitle="Common reminder types for routine care" />
        <View style={styles.quickGrid}>
          <Link href="/entries/appointment" asChild>
            <Button label="Vet visit" variant="secondary" />
          </Link>
          <Link href="/entries/appointment" asChild>
            <Button label="Grooming" variant="secondary" />
          </Link>
          <Link href="/entries/medication" asChild>
            <Button label="Medication" variant="secondary" />
          </Link>
          <Link href="/entries/vaccine" asChild>
            <Button label="Vaccine" variant="secondary" />
          </Link>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: 24,
  },
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
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
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 4,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
