import { Pressable, StyleSheet, Text } from 'react-native';

import { palette, radii } from '../utils/theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'default' | 'small';
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', size = 'default', disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'small' ? styles.small : styles.default,
        variant === 'primary' ? styles.primary : null,
        variant === 'secondary' ? styles.secondary : null,
        variant === 'danger' ? styles.danger : null,
        (pressed || disabled) ? styles.pressed : null,
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
    borderRadius: radii.md,
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
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.line,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: palette.danger,
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
