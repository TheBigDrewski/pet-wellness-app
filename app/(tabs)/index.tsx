import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { PetAvatar } from '../../src/components/PetAvatar';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { formatDateTime, formatRelativeDate } from '../../src/utils/date';
import { palette, shadows } from '../../src/utils/theme';

export default function DashboardScreen() {
  const { dashboard, isHydrated } = usePetCare();

  if (!isHydrated) {
    return (
      <Screen>
        <Text style={styles.loading}>Loading your local pet data…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <Text style={styles.eyebrow}>Local-first care companion</Text>
          <Text style={styles.heroTitle}>Keep every pet’s daily care in one place.</Text>
          <Text style={styles.heroBody}>
            Track meals, symptoms, meds, appointments, records, and weight without needing an account
            or backend.
          </Text>
          <View style={styles.heroActions}>
            <Link href="/entries/health" asChild>
              <Button label="Add health log" />
            </Link>
            <Link href="/entries/appointment" asChild>
              <Button label="Add reminder" variant="secondary" />
            </Link>
          </View>
        </Card>

        <SectionHeader
          title="Your Pets"
          actionLabel="Add pet"
          href="/pets/new"
          subtitle={`${dashboard.pets.length} profiles available`}
        />
        {dashboard.pets.length ? (
          <View style={styles.petGrid}>
            {dashboard.pets.map((pet) => (
              <Link key={pet.id} href={`/pets/${pet.id}`} asChild>
                <Pressable style={styles.petCardLink}>
                  <PetAvatar name={pet.name} species={pet.species} size={48} />
                  <Card style={styles.petCard}>
                    <View style={styles.petMeta}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petSubtext}>
                        {pet.species} • {pet.breed || 'Breed not set'}
                      </Text>
                      <Text style={styles.petSubtext}>Latest weight: {pet.latestWeightLabel}</Text>
                    </View>
                  </Card>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : (
          <EmptyState
            title="No pets yet"
            description="Create a pet profile to start logging health, feeding, and reminders."
            ctaLabel="Create first pet"
            href="/pets/new"
          />
        )}

        <SectionHeader title="Quick Actions" subtitle="Fast entry points for daily care" />
        <View style={styles.quickGrid}>
          <Link href="/entries/health" asChild>
            <Button label="Health log" variant="secondary" />
          </Link>
          <Link href="/entries/feeding" asChild>
            <Button label="Meal" variant="secondary" />
          </Link>
          <Link href="/entries/appointment" asChild>
            <Button label="Appointment" variant="secondary" />
          </Link>
          <Link href="/entries/medication" asChild>
            <Button label="Medication" variant="secondary" />
          </Link>
        </View>

        <SectionHeader title="Upcoming" subtitle="Appointments, reminders, and medication due next" />
        {dashboard.upcomingItems.length ? (
          dashboard.upcomingItems.map((item) => (
            <Card key={item.id} style={styles.timelineCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineBadge}>{formatRelativeDate(item.when)}</Text>
              </View>
              <Text style={styles.timelineMeta}>
                {item.petName} • {formatDateTime(item.when)}
              </Text>
              <Text style={styles.timelineBody}>{item.description}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            title="Nothing upcoming"
            description="Reminders, appointments, and due medications will appear here."
          />
        )}

        <SectionHeader title="Recent Activity" subtitle="Latest feeding, health, and weight logs" />
        {dashboard.recentActivity.length ? (
          dashboard.recentActivity.map((entry) => (
            <Card key={entry.id} style={styles.timelineCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.timelineTitle}>{entry.title}</Text>
                <Text style={styles.timelineBadge}>{entry.kind}</Text>
              </View>
              <Text style={styles.timelineMeta}>
                {entry.petName} • {formatDateTime(entry.when)}
              </Text>
              <Text style={styles.timelineBody}>{entry.description}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No activity yet"
            description="Add a meal, symptom, medication, or weight log to build your timeline."
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
  loading: {
    color: palette.muted,
    fontSize: 16,
  },
  hero: {
    backgroundColor: palette.hero,
    borderColor: '#efceb7',
    ...shadows.soft,
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginTop: 8,
  },
  heroBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  petGrid: {
    gap: 12,
  },
  petCard: {
    flex: 1,
  },
  petCardLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  petMeta: {
    flex: 1,
    gap: 2,
  },
  petName: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  petSubtext: {
    color: palette.muted,
    fontSize: 13,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timelineCard: {
    gap: 8,
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  timelineTitle: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  timelineMeta: {
    color: palette.muted,
    fontSize: 13,
  },
  timelineBody: {
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  timelineBadge: {
    backgroundColor: '#f3e4d6',
    borderRadius: 999,
    color: palette.accent,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
