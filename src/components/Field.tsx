import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { palette } from '../utils/theme';

type FieldProps = TextInputProps & {
  label: string;
};

export function Field({ label, ...props }: FieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9d8f83"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function TextAreaField({ label, ...props }: FieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline
        numberOfLines={4}
        placeholderTextColor="#9d8f83"
        style={[styles.input, styles.textarea]}
        textAlignVertical="top"
        {...props}
      />
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
  input: {
    backgroundColor: '#fffaf5',
    borderColor: '#ddcbbd',
    borderRadius: 16,
    borderWidth: 1,
    color: palette.ink,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 112,
  },
});
