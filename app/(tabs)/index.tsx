import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { PetAvatar } from '../../src/components/PetAvatar';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatusBadge } from '../../src/components/StatusBadge';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { formatDateTime, formatRelativeDate } from '../../src/utils/date';
import { palette, spacing } from '../../src/utils/theme';

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
          <Text style={styles.eyebrow}>Phase 1.5 local-first care hub</Text>
          <Text style={styles.heroTitle}>Daily pet care, reminders, and records in one app.</Text>
          <Text style={styles.heroBody}>
            Everything stays on-device and works in the browser or Expo Go, with stronger timelines,
            reminders, vaccine tracking, and backup safety.
          </Text>
          <View style={styles.heroActions}>
            <Link href="/entries/health" asChild>
              <Button label="Add health log" />
            </Link>
            <Link href="/entries/appointment" asChild>
              <Button label="Add reminder" variant="secondary" />
            </Link>
            <Link href="/entries/vaccine" asChild>
              <Button label="Add vaccine" variant="secondary" />
            </Link>
          </View>
        </Card>

        <SectionHeader
          title="Pet Status"
          subtitle={`${dashboard.pets.length} pet${dashboard.pets.length === 1 ? '' : 's'} tracked locally`}
          actionLabel="Add pet"
          href="/pets/new"
        />
        {dashboard.pets.length ? (
          <View style={styles.petGrid}>
            {dashboard.pets.map((pet) => (
              <Link key={pet.id} href={`/pets/${pet.id}`} asChild>
                <Pressable style={styles.petLink}>
                  <Card style={styles.petCard}>
                    <View style={styles.petHeader}>
                      <PetAvatar name={pet.name} species={pet.species} photoUri={pet.photoUri} size={60} />
                      <View style={styles.petMeta}>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petSubtext}>
                          {pet.species} • {pet.breed || 'Breed not recorded'}
                        </Text>
                        <Text style={styles.petSubtext}>Latest weight: {pet.latestWeightLabel}</Text>
                      </View>
                      <StatusBadge label={`Score ${pet.careScore}`} status={pet.careScore < 70 ? 'warning' : 'current'} />
                    </View>
                    <View style={styles.petFooter}>
                      <Text style={styles.petInfo}>{pet.statusSummary}</Text>
                      <Text style={styles.petInfo}>{pet.vaccineStatus}</Text>
                    </View>
                  </Card>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : (
          <EmptyState
            title="No pets yet"
            description="Create a pet profile to start logging health, medication, diet, and care reminders."
            ctaLabel="Create first pet"
            href="/pets/new"
          />
        )}

        <SectionHeader title="Health Alerts" subtitle="Recent concerns and overdue care items" />
        {dashboard.healthAlerts.length ? (
          dashboard.healthAlerts.map((alert) => (
            <Card key={alert.id} style={styles.alertCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{alert.title}</Text>
                <StatusBadge label={alert.status === 'warning' ? 'Needs attention' : 'Recent update'} status={alert.status} />
              </View>
              <Text style={styles.cardMeta}>{alert.petName}</Text>
              <Text style={styles.cardBody}>{alert.detail}</Text>
            </Card>
          ))
        ) : (
          <EmptyState title="No active alerts" description="Overdue items and recent health concerns will appear here." />
        )}

        <SectionHeader title="Quick Actions" subtitle="Fast entry points for routine care" />
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

        <SectionHeader title="Upcoming Due Items" subtitle="Appointments, medication doses, and vaccines due next" />
        {dashboard.upcomingItems.length ? (
          dashboard.upcomingItems.slice(0, 8).map((item) => (
            <Card key={item.id} style={styles.timelineCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <StatusBadge label={item.status || 'Upcoming'} status={item.status} />
              </View>
              <Text style={styles.cardMeta}>
                {item.petName} • {formatDateTime(item.date)} • {item.group}
              </Text>
              <Text style={styles.cardBody}>{item.subtitle}</Text>
              <Text style={styles.cardHint}>{item.notes || formatRelativeDate(item.date)}</Text>
            </Card>
          ))
        ) : (
          <EmptyState title="Nothing upcoming" description="Reminders, appointments, and due medications will appear here." />
        )}

        <SectionHeader title="Recently Logged" subtitle="The latest combined activity across all pets" />
        {dashboard.recentActivity.length ? (
          dashboard.recentActivity.slice(0, 10).map((entry) => (
            <Card key={entry.id} style={styles.timelineCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{entry.title}</Text>
                <StatusBadge label={entry.type} status={entry.status || 'upcoming'} />
              </View>
              <Text style={styles.cardMeta}>
                {entry.petName} • {formatDateTime(entry.date)}
              </Text>
              <Text style={styles.cardBody}>{entry.subtitle}</Text>
              <Text style={styles.cardHint}>{entry.notes || 'No notes'}</Text>
            </Card>
          ))
        ) : (
          <EmptyState title="No activity yet" description="Add a meal, symptom, medication, or weight log to build the timeline." />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: 32,
  },
  loading: {
    color: palette.muted,
    fontSize: 16,
  },
  hero: {
    backgroundColor: palette.hero,
    gap: spacing.sm,
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
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  heroBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  petGrid: {
    gap: spacing.sm,
  },
  petLink: {
    width: '100%',
  },
  petCard: {
    gap: spacing.sm,
  },
  petHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  petMeta: {
    flex: 1,
    gap: 2,
  },
  petName: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  petSubtext: {
    color: palette.muted,
    fontSize: 13,
  },
  petFooter: {
    gap: 4,
  },
  petInfo: {
    color: palette.ink,
    fontSize: 14,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  alertCard: {
    gap: spacing.xs,
  },
  timelineCard: {
    gap: spacing.xs,
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  cardMeta: {
    color: palette.muted,
    fontSize: 13,
  },
  cardBody: {
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  cardHint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
