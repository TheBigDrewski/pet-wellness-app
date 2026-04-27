import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '../utils/theme';

export function Screen({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: palette.canvas,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
