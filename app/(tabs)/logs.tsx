import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { formatDateTime } from '../../src/utils/date';
import { palette } from '../../src/utils/theme';

export default function LogsScreen() {
  const { dashboard } = usePetCare();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title="Recent Logs"
          subtitle="Health, feeding, weight, and record activity"
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
          <Link href="/entries/medication" style={styles.quickLink}>
            Medication
          </Link>
        </View>

        {dashboard.recentActivity.length ? (
          dashboard.recentActivity.map((entry) => (
            <Card key={entry.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.title}>{entry.title}</Text>
                <Text style={styles.badge}>{entry.kind}</Text>
              </View>
              <Text style={styles.meta}>
                {entry.petName} • {formatDateTime(entry.when)}
              </Text>
              <Text style={styles.body}>{entry.description}</Text>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No logs yet"
            description="Use the quick add actions to start recording daily health and care activity."
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
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickLink: {
    backgroundColor: '#fff',
    borderColor: '#eadccf',
    borderRadius: 999,
    borderWidth: 1,
    color: palette.accent,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  card: {
    gap: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#f3e4d6',
    borderRadius: 999,
    color: palette.accent,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    textTransform: 'capitalize',
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
