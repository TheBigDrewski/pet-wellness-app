import { StyleSheet, Text, View } from 'react-native';

import { palette } from '../utils/theme';

type PetAvatarProps = {
  name: string;
  species: string;
  size?: number;
};

const speciesGlyph: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
  rabbit: '🐰',
  bird: '🐦',
  reptile: '🦎',
};

export function PetAvatar({ name, species, size = 52 }: PetAvatarProps) {
  const emoji = speciesGlyph[species.toLowerCase()] ?? '🐾';
  return (
    <View style={[styles.container, { height: size, width: size, borderRadius: size / 2 }]}>
      <Text style={[styles.emoji, { fontSize: size / 2.2 }]}>{emoji}</Text>
      <Text style={styles.initial}>{name.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f7ddc4',
    borderColor: '#efceb7',
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emoji: {
    opacity: 0.94,
  },
  initial: {
    bottom: 3,
    color: palette.accent,
    fontSize: 10,
    fontWeight: '700',
    position: 'absolute',
    right: 6,
  },
});
