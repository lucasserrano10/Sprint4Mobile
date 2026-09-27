import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../contexts/AuthContext';
import { useVehicleContext } from '../contexts/VehicleContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card, SectionHeader, Divider } from '../components/Card';
import { Button } from '../components/Button';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { StatusBadge } from '../components/Badges';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { ServiceType, Appointment, AppointmentStatus } from '../types/vehicle';
import { SERVICE_TYPE_LABELS } from '../constants/app';
import { MOCK_PARTNER_SHOPS } from '../constants/app';
import { createAppointment, getAppointmentsByOwner, cancelAppointment } from '../services/appointmentService';

type Props = {
  onBack: () => void;
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  vehicleId?: string;
};

type Step = 'list' | 'create_service' | 'create_shop' | 'create_datetime' | 'create_confirm';

const SERVICE_OPTIONS: ServiceType[] = [
  'oil_change', 'full_revision', 'tire_rotation', 'brake_inspection',
  'alignment_balancing', 'air_filter', 'spark_plugs', 'diagnostic',
];

const STATUS_MAP: Record<AppointmentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  pending: { label: 'Pendente', variant: 'neutral' },
  confirmed: { label: 'Confirmado', variant: 'success' },
  completed: { label: 'Concluído', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
  no_show: { label: 'Não compareceu', variant: 'danger' },
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_001',
    vehicleId: 'vehicle_001',
    ownerId: 'demo_user',
    shopId: 'shop_001',
    shopName: 'Auto Ford Sorocaba',
    serviceType: 'full_revision',
    description: 'Revisão dos 60.000 km',
    scheduledDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
    estimatedDuration: 120,
    estimatedCost: 890,
    status: 'confirmed',
    notes: 'Trazer documento do veículo.',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    confirmedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    reminderSent: true,
  },
];

export function AppointmentScreen({ onBack, onNavigate, vehicleId }: Props): JSX.Element {
  const { user } = useAuthContext();
  const { activeVehicle } = useVehicleContext();

  const [step, setStep] = useState<Step>('list');
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulário de novo agendamento
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleCancel = useCallback(async (appointmentId: string) => {
    Alert.alert(
      'Cancelar agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === appointmentId ? { ...a, status: 'cancelled' as AppointmentStatus } : a
              )
            );
          },
        },
      ]
    );
  }, []);

  const handleConfirmAppointment = useCallback(async () => {
    if (!user || !activeVehicle || !selectedService || !selectedShopId || !selectedDate || !selectedTime) {
      Alert.alert('Campos incompletos', 'Preencha todos os campos para agendar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const shop = MOCK_PARTNER_SHOPS.find((s) => s.id === selectedShopId);
      const [day, month, year] = selectedDate.split('/').map(Number);
      const [hour, minute] = selectedTime.split(':').map(Number);
      const scheduledDate = new Date(year, month - 1, day, hour, minute).getTime();

      const newAppointment: Appointment = {
        id: `apt_${Date.now()}`,
        vehicleId: activeVehicle.id,
        ownerId: user.uid,
        shopId: selectedShopId,
        shopName: shop?.name ?? 'Oficina',
        serviceType: selectedService,
        description: SERVICE_TYPE_LABELS[selectedService],
        scheduledDate,
        estimatedDuration: 90,
        estimatedCost: shop?.certification === 'ford_dealer' ? 890 : 450,
        status: 'pending',
        notes,
        createdAt: Date.now(),
        confirmedAt: null,
        reminderSent: false,
      };

      setAppointments((prev) => [newAppointment, ...prev]);

      // Reset form
      setSelectedService(null);
      setSelectedShopId(null);
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
      setStep('list');

      Alert.alert(
        'Agendamento criado! ✅',
        `Seu agendamento na ${shop?.name ?? 'oficina'} foi criado com sucesso. Você receberá uma confirmação em breve.`
      );
    } catch {
      setError('Não foi possível criar o agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [user, activeVehicle, selectedService, selectedShopId, selectedDate, selectedTime, notes]);

  // ─── Lista de Agendamentos ────────────────────────────────────────────────

  if (step === 'list') {
    const upcoming = appointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed');
    const past = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader
          title="Meus Agendamentos"
          subtitle={activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model}` : ''}
          onBack={onBack}
          variant="ford"
          rightAction={{ icon: '+ Agendar', label: '+ Agendar', onPress: () => setStep('create_service') }}
        />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {error && <FeedbackBanner message={error} onDismiss={() => setError(null)} />}

            {upcoming.length === 0 && (
              <TouchableOpacity
                style={styles.emptyCard}
                onPress={() => setStep('create_service')}
                activeOpacity={0.85}
              >
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyTitle}>Nenhum agendamento ativo</Text>
                <Text style={styles.emptySubtitle}>
                  Agende sua manutenção na rede Ford em segundos.
                </Text>
                <View style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Agendar agora →</Text>
                </View>
              </TouchableOpacity>
            )}

            {upcoming.length > 0 && (
              <>
                <SectionHeader title="Próximos agendamentos" />
                {upcoming.map((apt) => {
                  const statusInfo = STATUS_MAP[apt.status];
                  return (
                    <Card key={apt.id} style={styles.aptCard}>
                      <View style={styles.aptHeader}>
                        <View>
                          <Text style={styles.aptService}>
                            {SERVICE_TYPE_LABELS[apt.serviceType]}
                          </Text>
                          <Text style={styles.aptShop}>{apt.shopName}</Text>
                        </View>
                        <StatusBadge label={statusInfo.label} variant={statusInfo.variant} />
                      </View>

                      <View style={styles.aptDetails}>
                        <View style={styles.aptDetail}>
                          <Text style={styles.aptDetailIcon}>📅</Text>
                          <Text style={styles.aptDetailText}>
                            {new Date(apt.scheduledDate).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                            })}
                          </Text>
                        </View>
                        <View style={styles.aptDetail}>
                          <Text style={styles.aptDetailIcon}>🕐</Text>
                          <Text style={styles.aptDetailText}>
                            {new Date(apt.scheduledDate).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                        <View style={styles.aptDetail}>
                          <Text style={styles.aptDetailIcon}>💰</Text>
                          <Text style={styles.aptDetailText}>
                            Est. R$ {apt.estimatedCost.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                      </View>

                      {apt.notes && (
                        <Text style={styles.aptNotes}>📋 {apt.notes}</Text>
                      )}

                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleCancel(apt.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cancelButtonText}>Cancelar agendamento</Text>
                        </TouchableOpacity>
                      )}
                    </Card>
                  );
                })}
              </>
            )}

            {past.length > 0 && (
              <>
                <SectionHeader title="Histórico" />
                {past.map((apt) => {
                  const statusInfo = STATUS_MAP[apt.status];
                  return (
                    <Card key={apt.id} style={styles.aptCardPast}>
                      <View style={styles.aptHeader}>
                        <View>
                          <Text style={[styles.aptService, styles.aptServicePast]}>
                            {SERVICE_TYPE_LABELS[apt.serviceType]}
                          </Text>
                          <Text style={styles.aptShop}>{apt.shopName}</Text>
                        </View>
                        <StatusBadge label={statusInfo.label} variant={statusInfo.variant} small />
                      </View>
                    </Card>
                  );
                })}
              </>
            )}

            <View style={styles.bottomPad} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Wizard de Agendamento ────────────────────────────────────────────────

  const stepTitles: Record<Step, string> = {
    list: 'Agendamentos',
    create_service: 'Tipo de serviço',
    create_shop: 'Escolher oficina',
    create_datetime: 'Data e horário',
    create_confirm: 'Confirmar',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Novo Agendamento"
        subtitle={stepTitles[step]}
        onBack={() => {
          const prev: Record<Step, Step> = {
            list: 'list',
            create_service: 'list',
            create_shop: 'create_service',
            create_datetime: 'create_shop',
            create_confirm: 'create_datetime',
          };
          setStep(prev[step]);
        }}
        variant="ford"
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {error && <FeedbackBanner message={error} onDismiss={() => setError(null)} />}

            {/* ─ Step 1: Tipo de serviço ─ */}
            {step === 'create_service' && (
              <Card>
                <Text style={styles.stepTitle}>Qual tipo de serviço você precisa?</Text>
                <Text style={styles.stepSubtitle}>Selecione o serviço desejado</Text>
                <Divider margin="sm" />
                <View style={styles.serviceGrid}>
                  {SERVICE_OPTIONS.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.serviceOption,
                        selectedService === type && styles.serviceOptionActive,
                      ]}
                      onPress={() => setSelectedService(type)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.serviceOptionIcon}>
                        {type === 'oil_change' ? '💧' : type === 'full_revision' ? '🔧' : type === 'tire_rotation' ? '⭕' : type === 'brake_inspection' ? '⚠️' : type === 'alignment_balancing' ? '⚙️' : type === 'air_filter' ? '💨' : type === 'spark_plugs' ? '⚡' : '🔍'}
                      </Text>
                      <Text
                        style={[
                          styles.serviceOptionLabel,
                          selectedService === type && styles.serviceOptionLabelActive,
                        ]}
                      >
                        {SERVICE_TYPE_LABELS[type]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button
                  label="Próximo →"
                  onPress={() => selectedService && setStep('create_shop')}
                  disabled={!selectedService}
                  fullWidth
                  size="md"
                />
              </Card>
            )}

            {/* ─ Step 2: Escolher oficina ─ */}
            {step === 'create_shop' && (
              <View style={{ gap: Spacing.sm }}>
                <Text style={styles.stepCardTitle}>Escolha uma oficina</Text>
                {MOCK_PARTNER_SHOPS.map((shop) => (
                  <Card
                    key={shop.id}
                    style={[styles.shopCard, selectedShopId === shop.id && styles.shopCardActive]}
                    onPress={() => setSelectedShopId(shop.id)}
                  >
                    <View style={styles.shopCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.shopName}>{shop.name}</Text>
                        <Text style={styles.shopAddress}>
                          {shop.neighborhood}, {shop.city}
                        </Text>
                        <Text style={styles.shopDistance}>📍 {shop.distanceKm} km de você</Text>
                      </View>
                      <View style={styles.shopRating}>
                        <Text style={styles.shopRatingValue}>⭐ {shop.rating}</Text>
                        <Text style={styles.shopRatingCount}>({shop.reviewCount})</Text>
                      </View>
                    </View>
                    {selectedShopId === shop.id && (
                      <View style={styles.shopSelected}>
                        <Text style={styles.shopSelectedText}>✓ Selecionada</Text>
                      </View>
                    )}
                  </Card>
                ))}
                <Button
                  label="Próximo →"
                  onPress={() => selectedShopId && setStep('create_datetime')}
                  disabled={!selectedShopId}
                  fullWidth
                  size="md"
                />
              </View>
            )}

            {/* ─ Step 3: Data e Horário ─ */}
            {step === 'create_datetime' && (
              <Card>
                <Text style={styles.stepTitle}>Quando você prefere?</Text>
                <Divider margin="sm" />
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Data *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={Colors.textMuted}
                    value={selectedDate}
                    onChangeText={setSelectedDate}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Horário *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="HH:MM (Ex: 09:00)"
                    placeholderTextColor={Colors.textMuted}
                    value={selectedTime}
                    onChangeText={setSelectedTime}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Observações</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.textArea]}
                    placeholder="Ex: Trazer documento do veículo..."
                    placeholderTextColor={Colors.textMuted}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                  />
                </View>
                <Button
                  label="Revisar agendamento →"
                  onPress={() => (selectedDate && selectedTime) && setStep('create_confirm')}
                  disabled={!selectedDate || !selectedTime}
                  fullWidth
                  size="md"
                />
              </Card>
            )}

            {/* ─ Step 4: Confirmação ─ */}
            {step === 'create_confirm' && selectedService && selectedShopId && (
              <View style={{ gap: Spacing.base }}>
                <Card>
                  <Text style={styles.stepTitle}>Confirmar agendamento</Text>
                  <Divider margin="sm" />
                  {[
                    { label: 'Veículo', value: activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model} ${activeVehicle.year}` : 'Não selecionado' },
                    { label: 'Serviço', value: SERVICE_TYPE_LABELS[selectedService] },
                    { label: 'Oficina', value: MOCK_PARTNER_SHOPS.find((s) => s.id === selectedShopId)?.name ?? '' },
                    { label: 'Data', value: selectedDate },
                    { label: 'Horário', value: selectedTime },
                  ].map(({ label, value }) => (
                    <View key={label} style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>{label}</Text>
                      <Text style={styles.confirmValue}>{value}</Text>
                    </View>
                  ))}
                </Card>
                <Button
                  label="Confirmar agendamento ✓"
                  onPress={handleConfirmAppointment}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                  size="lg"
                />
                <Button
                  label="Voltar e editar"
                  onPress={() => setStep('create_datetime')}
                  variant="outline"
                  fullWidth
                  size="md"
                />
              </View>
            )}

            <View style={styles.bottomPad} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.fordBlue },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.fordBluePale,
    borderStyle: 'dashed',
    ...Shadows.md,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center' },
  emptyButton: {
    backgroundColor: Colors.fordBlue,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  emptyButtonText: { color: Colors.white, fontWeight: Typography.semibold, fontSize: Typography.sm },
  aptCard: { marginBottom: Spacing.sm, gap: Spacing.md },
  aptCardPast: { marginBottom: Spacing.sm, opacity: 0.7 },
  aptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  aptService: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  aptServicePast: { color: Colors.textMuted },
  aptShop: { fontSize: Typography.sm, color: Colors.textMuted, marginTop: 2 },
  aptDetails: { gap: Spacing.xs },
  aptDetail: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  aptDetailIcon: { fontSize: 14, width: 20 },
  aptDetailText: { fontSize: Typography.sm, color: Colors.textSecondary },
  aptNotes: { fontSize: Typography.xs, color: Colors.textMuted, fontStyle: 'italic' },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  cancelButtonText: { color: Colors.danger, fontSize: Typography.sm, fontWeight: Typography.semibold },
  stepTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: 4 },
  stepSubtitle: { fontSize: Typography.sm, color: Colors.textMuted },
  stepCardTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base },
  serviceOption: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  serviceOptionActive: { borderColor: Colors.fordBlue, backgroundColor: Colors.fordBluePale },
  serviceOptionIcon: { fontSize: 24 },
  serviceOptionLabel: { fontSize: Typography.xs, textAlign: 'center', color: Colors.textSecondary, fontWeight: Typography.medium },
  serviceOptionLabelActive: { color: Colors.fordBlue, fontWeight: Typography.semibold },
  shopCard: { borderWidth: 1.5, borderColor: Colors.border, gap: Spacing.sm },
  shopCardActive: { borderColor: Colors.fordBlue, backgroundColor: Colors.fordBluePale },
  shopCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  shopName: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  shopAddress: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  shopDistance: { fontSize: Typography.xs, color: Colors.fordBlueLight, marginTop: 2 },
  shopRating: { alignItems: 'flex-end' },
  shopRatingValue: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  shopRatingCount: { fontSize: Typography.xs, color: Colors.textMuted },
  shopSelected: { backgroundColor: Colors.fordBlue, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 3, alignSelf: 'flex-start' },
  shopSelectedText: { color: Colors.white, fontSize: Typography.xs, fontWeight: Typography.semibold },
  formField: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary, marginBottom: Spacing.xs },
  fieldInput: { height: 48, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, fontSize: Typography.base, color: Colors.textPrimary, backgroundColor: Colors.surfaceAlt },
  textArea: { height: 80, paddingTop: Spacing.sm, textAlignVertical: 'top' },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs },
  confirmLabel: { fontSize: Typography.sm, color: Colors.textMuted },
  confirmValue: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: Spacing.base },
  bottomPad: { height: Spacing.xxl },
});
