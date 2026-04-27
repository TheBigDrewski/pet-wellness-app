import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { formatDateTime } from '../../src/utils/date';
import { palette } from '../../src/utils/theme';

export default function CalendarScreen() {
  const { dashboard } = usePetCare();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title="Upcoming Care"
          subtitle="Appointments, reminders, and medication due next"
          actionLabel="Add event"
          href="/entries/appointment"
        />

        {dashboard.upcomingItems.length ? (
          dashboard.upcomingItems.map((item) => (
            <Card key={item.id} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.petName} • {formatDateTime(item.when)}
              </Text>
              <Text style={styles.body}>{item.description}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No upcoming items"
            description="Appointments and due medication reminders will show up here."
          />
        )}

        <SectionHeader title="Past Appointments" subtitle="Previous reminders and visits" />
        {dashboard.pastAppointments.length ? (
          dashboard.pastAppointments.map((item) => (
            <Card key={item.id} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.petName} • {formatDateTime(item.when)}
              </Text>
              <Text style={styles.body}>{item.description}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No past appointments"
            description="Completed visits and reminders will appear after their scheduled time passes."
          />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    gap: 8,
  },
  title: {
    color: palette.ink,
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
});
