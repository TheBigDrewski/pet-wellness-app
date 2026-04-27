import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette, spacing } from '../utils/theme';

export function Screen({ children }: PropsWithChildren) {
  return (
    <View style={styles.screen}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: palette.canvas,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  inner: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 1100,
    width: '100%',
  },
});
