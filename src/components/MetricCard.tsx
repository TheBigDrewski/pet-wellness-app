import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { palette, spacing } from '../utils/theme';

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 150,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  hint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
