import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { Card } from './Card';
import { palette } from '../utils/theme';

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  href?: string;
};

export function EmptyState({ title, description, ctaLabel, href }: EmptyStateProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {ctaLabel && href ? (
        <Link href={href} asChild>
          <Button label={ctaLabel} variant="secondary" />
        </Link>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: 10,
  },
  title: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
