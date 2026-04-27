import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { exportSnapshot, importSnapshotFile } from '../../src/utils/storageTransfer';
import { palette, spacing } from '../../src/utils/theme';

export default function SettingsScreen() {
  const { snapshot, restoreDemoData, clearAllData, importData } = usePetCare();

  const handleExport = async () => {
    try {
      await exportSnapshot(snapshot);
      Alert.alert('Export complete', Platform.OS === 'web' ? 'JSON download started.' : 'Backup file ready to share.');
    } catch (error) {
      Alert.alert('Export failed', error instanceof Error ? error.message : 'Unable to export data.');
    }
  };

  const handleImport = async () => {
    try {
      const next = await importSnapshotFile();
      if (!next) {
        return;
      }
      const confirmed = await confirmReplace(
        'Replace local data?',
        'Importing a backup replaces the current pets, logs, reminders, and records on this device.'
      );
      if (!confirmed) {
        return;
      }
      await importData(next);
      Alert.alert('Import complete', 'The local backup has been validated and restored.');
    } catch (error) {
      Alert.alert('Import failed', error instanceof Error ? error.message : 'Unable to import that file.');
    }
  };

  const handleRestoreDemo = async () => {
    if (!(await confirmReplace('Reload demo data?', 'This will replace the current local data with sample demo content.'))) {
      return;
    }
    await restoreDemoData();
  };

  const handleClear = async () => {
    if (!(await confirmReplace('Clear all local data?', 'This permanently removes pets, logs, reminders, and records from this device.'))) {
      return;
    }
    await clearAllData();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title="Data" subtitle="Backups, imports, demo data, and reset controls" />
        <Card style={styles.card}>
          <Text style={styles.title}>Backup and restore</Text>
          <Text style={styles.body}>
            Export all pets, logs, reminders, medication history, vaccines, and records as JSON. Imports are
            validated before replacing local data.
          </Text>
          <View style={styles.actions}>
            <Button label="Export JSON" onPress={handleExport} />
            <Button label="Import JSON" variant="secondary" onPress={handleImport} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.title}>Demo and reset</Text>
          <Text style={styles.body}>
            Reload sample pets and events for testing, or clear the app back to an empty local state.
          </Text>
          <View style={styles.actions}>
            <Button label="Reload demo data" variant="secondary" onPress={handleRestoreDemo} />
            <Button label="Clear all data" variant="danger" onPress={handleClear} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.title}>Local-first notes</Text>
          <Text style={styles.body}>
            Pet profile photos use local URIs. Imported backups restore the URI values, but the underlying image
            files may not exist on a different device or browser.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

async function confirmReplace(title: string, message: string) {
  if (Platform.OS === 'web') {
    return window.confirm(`${title}\n\n${message}`);
  }

  return new Promise<boolean>((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Continue', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: 24,
  },
  card: {
    gap: spacing.sm,
  },
  title: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
