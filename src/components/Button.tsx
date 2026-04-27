import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '../utils/theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'default' | 'small';
};

export function Button({ label, onPress, variant = 'primary', size = 'default' }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'small' ? styles.small : styles.default,
        variant === 'primary' ? styles.primary : null,
        variant === 'secondary' ? styles.secondary : null,
        variant === 'danger' ? styles.danger : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' ? styles.secondaryLabel : null,
          variant === 'danger' ? styles.dangerLabel : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
  },
  default: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  small: {
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primary: {
    backgroundColor: palette.accent,
  },
  secondary: {
    backgroundColor: '#fff',
    borderColor: '#eadccf',
    borderWidth: 1,
  },
  danger: {
    backgroundColor: '#7f2f32',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: palette.ink,
  },
  dangerLabel: {
    color: '#fff8f7',
  },
});
