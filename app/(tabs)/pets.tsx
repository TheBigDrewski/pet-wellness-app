import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { PetAvatar } from '../../src/components/PetAvatar';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { usePetCare } from '../../src/storage/PetCareProvider';
import { formatBirthday, formatPhone } from '../../src/utils/date';
import { palette } from '../../src/utils/theme';

export default function PetsScreen() {
  const { dashboard } = usePetCare();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title="Pet Profiles" subtitle="Manage your household pets" actionLabel="Add pet" href="/pets/new" />

        {dashboard.pets.length ? (
          dashboard.pets.map((pet) => (
            <Card key={pet.id} style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.identity}>
                  <PetAvatar name={pet.name} species={pet.species} size={56} />
                  <View style={styles.meta}>
                    <Text style={styles.name}>{pet.name}</Text>
                    <Text style={styles.subtext}>
                      {pet.species} • {pet.sex || 'Sex unknown'}
                    </Text>
                    <Text style={styles.subtext}>
                      {pet.breed || 'Breed not recorded'} • {formatBirthday(pet.birthday)}
                    </Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Link href={`/pets/${pet.id}`} asChild>
                    <Button label="Open" size="small" />
                  </Link>
                  <Link href={`/pets/new?petId=${pet.id}`} asChild>
                    <Button label="Edit" variant="secondary" size="small" />
                  </Link>
                </View>
              </View>
              <View style={styles.infoGrid}>
                <Text style={styles.infoText}>Latest weight: {pet.latestWeightLabel}</Text>
                <Text style={styles.infoText}>Microchip: {pet.microchipNumber || 'Not added'}</Text>
                <Text style={styles.infoText}>Vet: {pet.vetName || 'Not assigned'}</Text>
                <Text style={styles.infoText}>Phone: {formatPhone(pet.vetPhone)}</Text>
              </View>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No pet profiles yet"
            description="Start by adding your first pet profile with age, weight, and vet details."
            ctaLabel="Add pet profile"
            href="/pets/new"
          />
        )}
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
    gap: 14,
  },
  topRow: {
    gap: 12,
  },
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  subtext: {
    color: palette.muted,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoGrid: {
    gap: 8,
  },
  infoText: {
    color: palette.ink,
    fontSize: 14,
  },
});
