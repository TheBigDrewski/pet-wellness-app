import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { exportSnapshot, importSnapshotFile } from '../../src/utils/storageTransfer';
import { palette } from '../../src/utils/theme';

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
      await importData(next);
      Alert.alert('Import complete', 'The local backup has been restored.');
    } catch (error) {
      Alert.alert('Import failed', error instanceof Error ? error.message : 'Unable to import that file.');
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title="Data" subtitle="Manage local-only backups and demo content" />
        <Card style={styles.card}>
          <Text style={styles.title}>Backup and restore</Text>
          <Text style={styles.body}>
            Export all pets, logs, reminders, and records as JSON. Import the same JSON later on web or
            in Expo Go.
          </Text>
          <View style={styles.actions}>
            <Button label="Export JSON" onPress={handleExport} />
            <Button label="Import JSON" variant="secondary" onPress={handleImport} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.title}>Demo data</Text>
          <Text style={styles.body}>
            Load realistic sample pets and logs for testing or reset the app back to a fresh state.
          </Text>
          <View style={styles.actions}>
            <Button label="Reload demo data" variant="secondary" onPress={restoreDemoData} />
            <Button label="Clear all data" variant="danger" onPress={clearAllData} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.title}>About this MVP</Text>
          <Text style={styles.body}>
            Local-first storage only. No authentication, cloud sync, push notifications, or file uploads in
            phase 1.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    gap: 12,
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
    gap: 10,
  },
});
