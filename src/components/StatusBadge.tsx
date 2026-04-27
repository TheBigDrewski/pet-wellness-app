import { StyleSheet, Text, View } from 'react-native';

import { DueStatus } from '../types/models';
import { palette, radii } from '../utils/theme';

type StatusBadgeProps = {
  label: string;
  status?: DueStatus | 'warning' | 'info';
};

export function StatusBadge({ label, status = 'upcoming' }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, toneStyles[status]]}>
      <Text style={[styles.label, textStyles[status]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});

const toneStyles = StyleSheet.create({
  overdue: { backgroundColor: '#fde7e4' },
  dueToday: { backgroundColor: '#fcebd9' },
  upcoming: { backgroundColor: '#e9f2fb' },
  completed: { backgroundColor: '#e5f4eb' },
  current: { backgroundColor: '#e5f4eb' },
  expiringSoon: { backgroundColor: '#fff1dc' },
  expired: { backgroundColor: '#fde7e4' },
  warning: { backgroundColor: '#fff1dc' },
  info: { backgroundColor: '#e9f2fb' },
});

const textStyles = StyleSheet.create({
  overdue: { color: palette.danger },
  dueToday: { color: palette.warning },
  upcoming: { color: palette.info },
  completed: { color: palette.success },
  current: { color: palette.success },
  expiringSoon: { color: palette.warning },
  expired: { color: palette.danger },
  warning: { color: palette.warning },
  info: { color: palette.info },
});
