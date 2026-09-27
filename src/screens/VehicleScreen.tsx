import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../contexts/AuthContext';
import { useVehicleContext } from '../contexts/VehicleContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card, InfoRow, Divider } from '../components/Card';
import { Button } from '../components/Button';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { StatusBadge, CertificationBadge } from '../components/Badges';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { Vehicle } from '../types/vehicle';
import { MOCK_SERVICE_HISTORY } from '../constants/app';

type Props = {
  vehicleId?: string;
  onBack: () => void;
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
};

type AddVehicleForm = {
  vin: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  mileage: string;
};

const INITIAL_FORM: AddVehicleForm = {
  vin: '',
  brand: 'Ford',
  model: '',
  year: '',
  color: '',
  licensePlate: '',
  mileage: '',
};

// ─── Tela de Perfil do Veículo ────────────────────────────────────────────────

export function VehicleScreen({ vehicleId, onBack, onNavigate }: Props): JSX.Element {
  const { user } = useAuthContext();
  const { vehicles, activeVehicle } = useVehicleContext();

  const vehicle = vehicleId
    ? vehicles.find((v) => v.id === vehicleId) ?? activeVehicle
    : activeVehicle;

  if (!vehicle) {
    return <AddVehicleScreen onBack={onBack} />;
  }

  const serviceHistory = MOCK_SERVICE_HISTORY.filter((s) => s.vehicleId === vehicle.id || s.vin === vehicle.vin);
  const totalSpent = serviceHistory.reduce((sum, s) => sum + s.totalCost, 0);

  const fuelLabels = {
    flex: 'Flex (Gasolina/Etanol)',
    gasoline: 'Gasolina',
    diesel: 'Diesel',
    electric: 'Elétrico',
    hybrid: 'Híbrido',
  };

  const transmissionLabels = {
    manual: 'Manual',
    automatic: 'Automático',
    cvt: 'CVT',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Meu Veículo"
        subtitle={`${vehicle.brand} ${vehicle.model} · ${vehicle.year}`}
        onBack={onBack}
        variant="ford"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ─── Hero do Veículo ─────────────────────────────────────────── */}
        <View style={styles.vehicleHero}>
          <Text style={styles.vehicleEmoji}>🚗</Text>
          <Text style={styles.heroModel}>
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text style={styles.heroYear}>
            {vehicle.year} · {vehicle.color} · {vehicle.licensePlate}
          </Text>
        </View>

        <View style={styles.content}>
          {/* ─── KPIs ────────────────────────────────────────────────── */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{vehicle.mileage.toLocaleString('pt-BR')}</Text>
              <Text style={styles.kpiLabel}>km rodados</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{serviceHistory.length}</Text>
              <Text style={styles.kpiLabel}>serviços</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>R$ {(totalSpent / 1000).toFixed(1)}k</Text>
              <Text style={styles.kpiLabel}>investido</Text>
            </View>
          </View>

          {/* ─── VIN / Chassi ────────────────────────────────────────── */}
          <Card>
            <View style={styles.vinSection}>
              <View style={styles.vinHeader}>
                <Text style={styles.vinTitle}>VIN / Chassi</Text>
                <View style={styles.fordBadge}>
                  <Text style={styles.fordBadgeText}>✓ Histórico Ford</Text>
                </View>
              </View>
              <Text style={styles.vinCode}>{vehicle.vin}</Text>
              <Text style={styles.vinDescription}>
                Identificador único do veículo. Todo serviço realizado na rede Ford é registrado neste chassi — histórico auditável para revenda, seguro e financiamento.
              </Text>
            </View>
          </Card>

          {/* ─── Dados do Veículo ────────────────────────────────────── */}
          <Card>
            <Text style={styles.sectionTitle}>Dados do veículo</Text>
            <Divider margin="sm" />
            <InfoRow label="Marca" value={vehicle.brand} />
            <InfoRow label="Modelo" value={vehicle.model} />
            <InfoRow label="Ano" value={String(vehicle.year)} />
            <InfoRow label="Cor" value={vehicle.color} />
            <InfoRow label="Placa" value={vehicle.licensePlate} accent />
            <InfoRow label="Combustível" value={fuelLabels[vehicle.fuelType]} />
            <InfoRow label="Câmbio" value={transmissionLabels[vehicle.transmission]} />
            <InfoRow
              label="Quilometragem"
              value={`${vehicle.mileage.toLocaleString('pt-BR')} km`}
              accent
            />
          </Card>

          {/* ─── Próxima Manutenção ──────────────────────────────────── */}
          <Card>
            <Text style={styles.sectionTitle}>Próxima manutenção</Text>
            <Divider margin="sm" />
            <InfoRow
              label="Revisão prevista em"
              value={`${vehicle.nextServiceMileage.toLocaleString('pt-BR')} km`}
              accent
            />
            <InfoRow
              label="Faltam"
              value={`${(vehicle.nextServiceMileage - vehicle.mileage).toLocaleString('pt-BR')} km`}
            />
            {vehicle.nextServiceDate && (
              <InfoRow
                label="Data estimada"
                value={new Date(vehicle.nextServiceDate).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              />
            )}

            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min((vehicle.mileage / vehicle.nextServiceMileage) * 100, 100)}%`,
                      backgroundColor:
                        vehicle.mileage >= vehicle.nextServiceMileage
                          ? Colors.danger
                          : vehicle.nextServiceMileage - vehicle.mileage <= 2000
                          ? Colors.warning
                          : Colors.success,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>0 km</Text>
                <Text style={styles.progressLabel}>
                  {vehicle.nextServiceMileage.toLocaleString('pt-BR')} km
                </Text>
              </View>
            </View>

            <Button
              label="Agendar manutenção"
              onPress={() => onNavigate('Appointments', { vehicleId: vehicle.id })}
              fullWidth
              size="md"
              variant="primary"
            />
          </Card>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-tela: Cadastrar Veículo ──────────────────────────────────────────────

function AddVehicleScreen({ onBack }: { onBack: () => void }): JSX.Element {
  const { user } = useAuthContext();
  const { addVehicle, loading, error, clearError } = useVehicleContext();
  const [form, setForm] = useState<AddVehicleForm>(INITIAL_FORM);

  const updateField = useCallback((field: keyof AddVehicleForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    if (!form.vin || !form.model || !form.year || !form.licensePlate || !form.mileage) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (form.vin.length < 17) {
      Alert.alert('VIN inválido', 'O VIN/Chassi deve ter 17 caracteres.');
      return;
    }

    try {
      await addVehicle(user.uid, {
        vin: form.vin.toUpperCase(),
        brand: form.brand || 'Ford',
        model: form.model,
        year: parseInt(form.year, 10),
        color: form.color || 'Não informado',
        licensePlate: form.licensePlate.toUpperCase(),
        mileage: parseInt(form.mileage, 10),
        fuelType: 'flex',
        transmission: 'manual',
        nextServiceMileage: parseInt(form.mileage, 10) + 10000,
        nextServiceDate: null,
      });
      onBack();
    } catch {
      // Erro já tratado no contexto
    }
  }, [user, form, addVehicle, onBack]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Cadastrar Veículo" onBack={onBack} variant="ford" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {error && <FeedbackBanner message={error} onDismiss={clearError} />}

            <Card>
              <Text style={styles.sectionTitle}>Identificação do veículo</Text>
              <Text style={styles.formHint}>
                O VIN (Vehicle Identification Number) fica na plaqueta do painel, coluna da porta ou documento do veículo. Deve ter exatamente 17 caracteres.
              </Text>
              <Divider margin="sm" />

              {[
                { field: 'vin' as const, label: 'VIN / Chassi *', placeholder: 'Ex: 9BFZZ5FSXCT001234', caps: 'characters' as const },
                { field: 'brand' as const, label: 'Marca *', placeholder: 'Ford', caps: 'words' as const },
                { field: 'model' as const, label: 'Modelo *', placeholder: 'Ex: Ka 1.0 SE', caps: 'words' as const },
                { field: 'year' as const, label: 'Ano *', placeholder: 'Ex: 2016', caps: 'none' as const },
                { field: 'color' as const, label: 'Cor', placeholder: 'Ex: Prata Metálico', caps: 'words' as const },
                { field: 'licensePlate' as const, label: 'Placa *', placeholder: 'Ex: ABC1D23', caps: 'characters' as const },
                { field: 'mileage' as const, label: 'Quilometragem atual (km) *', placeholder: 'Ex: 58000', caps: 'none' as const },
              ].map(({ field, label, placeholder, caps }) => (
                <View key={field} style={styles.formField}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TextInput
                    style={[styles.fieldInput, field === 'vin' && styles.vinInput]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    value={form[field]}
                    onChangeText={updateField(field)}
                    autoCapitalize={caps}
                    keyboardType={
                      field === 'year' || field === 'mileage' ? 'numeric' : 'default'
                    }
                    editable={!loading}
                  />
                </View>
              ))}
            </Card>

            <Button
              label="Cadastrar veículo"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              fullWidth
              size="lg"
            />

            <View style={styles.bottomPad} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.fordBlue,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  vehicleHero: {
    backgroundColor: Colors.fordBlue,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl + 12,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vehicleEmoji: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  heroModel: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  heroYear: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
    marginTop: -Spacing.lg,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  kpiValue: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.fordBlue,
  },
  kpiLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  vinSection: {
    gap: Spacing.sm,
  },
  vinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vinTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  fordBadge: {
    backgroundColor: Colors.fordBluePale,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  fordBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.fordBlue,
  },
  vinCode: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.fordBlue,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
    backgroundColor: Colors.fordBluePale,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    textAlign: 'center',
  },
  vinDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * 1.5,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  progressSection: {
    gap: Spacing.xs,
    marginVertical: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  formHint: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * 1.5,
    marginBottom: Spacing.sm,
  },
  formField: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  fieldInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
  },
  vinInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  bottomPad: { height: Spacing.xxl },
});

