import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { palette } from '../utils/theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  href?: string;
};

export function SectionHeader({ title, subtitle, actionLabel, href }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.meta}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && href ? (
        <Link href={href} asChild>
          <Button label={actionLabel} size="small" variant="secondary" />
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
  },
});
