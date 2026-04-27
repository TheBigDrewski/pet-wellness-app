import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '../utils/theme';

type OptionFieldProps = {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
};

export function OptionField({ label, value, options, optionLabels, onChange }: OptionFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => onChange(option)}
              style={[styles.option, selected ? styles.optionSelected : null]}
            >
              <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                {optionLabels?.[option] ?? option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#fffaf5',
    borderColor: '#ddcbbd',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  optionText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
});
