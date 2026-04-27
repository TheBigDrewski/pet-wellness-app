import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { palette, radii, shadows, spacing } from '../utils/theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    ...shadows.soft,
  },
});
