import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../contexts/AuthContext';
import { useVehicleContext } from '../contexts/VehicleContext';
import { Card, SectionHeader } from '../components/Card';
import { Loading } from '../components/Loading';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { StatusBadge } from '../components/Badges';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { Vehicle } from '../types/vehicle';
import { SERVICE_TYPE_LABELS, MOCK_SERVICE_HISTORY } from '../constants/app';

type Props = {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
};

function getMileageStatus(vehicle: Vehicle): { label: string; variant: 'success' | 'warning' | 'danger' } {
  const remaining = vehicle.nextServiceMileage - vehicle.mileage;
  if (remaining <= 0) return { label: 'Revisão atrasada!', variant: 'danger' };
  if (remaining <= 2000) return { label: `Revisão em ${remaining.toLocaleString('pt-BR')} km`, variant: 'warning' };
  return { label: 'Revisão em dia', variant: 'success' };
}

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const firstName = name.split(' ')[0];
  if (hour < 12) return `Bom dia, ${firstName}!`;
  if (hour < 18) return `Boa tarde, ${firstName}!`;
  return `Boa noite, ${firstName}!`;
}

export function HomeScreen({ onNavigate }: Props): JSX.Element {
  const { user } = useAuthContext();
  const { vehicles, activeVehicle, loading, error, fetchVehicles, clearError } = useVehicleContext();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) fetchVehicles(user.uid);
  }, [user, fetchVehicles]);

  const handleRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchVehicles(user.uid);
    setRefreshing(false);
  }, [user, fetchVehicles]);

  if (!user) return <Loading fullScreen />;
  if (loading && vehicles.length === 0) return <Loading fullScreen label="Carregando seus veículos..." />;

  const recentServices = MOCK_SERVICE_HISTORY.slice(0, 2);
  const mileageStatus = activeVehicle ? getMileageStatus(activeVehicle) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.fordBlue} />
        }
      >
        {/* ─── Hero Header ─────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.logoRow}>
              <Text style={styles.logoFord}>FORD</Text>
              <Text style={styles.logoNexus}>NEXUS</Text>
            </View>
            <Text style={styles.greeting}>{getGreeting(user.name)}</Text>
            <Text style={styles.subtitle}>
              {activeVehicle
                ? `${activeVehicle.brand} ${activeVehicle.model} · ${activeVehicle.year}`
                : 'Cadastre seu veículo para começar'}
            </Text>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => onNavigate('Notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {error && (
          <FeedbackBanner message={error} onDismiss={clearError} variant="error" />
        )}

        <View style={styles.content}>
          {/* ─── Sem veículo cadastrado ──────────────────────────────── */}
          {vehicles.length === 0 && !loading && (
            <TouchableOpacity
              style={styles.addVehicleCard}
              onPress={() => onNavigate('AddVehicle')}
              activeOpacity={0.8}
            >
              <Text style={styles.addVehicleIcon}>🚗</Text>
              <View style={styles.addVehicleText}>
                <Text style={styles.addVehicleTitle}>Cadastre seu Ford</Text>
                <Text style={styles.addVehicleSubtitle}>
                  Adicione seu veículo pelo chassi (VIN) para acompanhar o histórico completo de manutenção.
                </Text>
              </View>
              <Text style={styles.addVehicleArrow}>›</Text>
            </TouchableOpacity>
          )}

          {/* ─── Status Card do Veículo Ativo ────────────────────────── */}
          {activeVehicle && (
            <Card style={styles.vehicleStatusCard} onPress={() => onNavigate('Vehicle', { vehicleId: activeVehicle.id })}>
              <View style={styles.vehicleCardHeader}>
                <View>
                  <Text style={styles.vehicleModel}>
                    {activeVehicle.brand} {activeVehicle.model}
                  </Text>
                  <Text style={styles.vehicleYear}>
                    {activeVehicle.year} · {activeVehicle.color} · {activeVehicle.licensePlate}
                  </Text>
                </View>
                <Text style={styles.vehicleArrow}>›</Text>
              </View>

              <View style={styles.vehicleStats}>
                <View style={styles.vehicleStat}>
                  <Text style={styles.vehicleStatValue}>
                    {activeVehicle.mileage.toLocaleString('pt-BR')}
                  </Text>
                  <Text style={styles.vehicleStatLabel}>km rodados</Text>
                </View>
                <View style={styles.vehicleStatDivider} />
                <View style={styles.vehicleStat}>
                  <Text style={styles.vehicleStatValue}>
                    {(activeVehicle.nextServiceMileage - activeVehicle.mileage).toLocaleString('pt-BR')}
                  </Text>
                  <Text style={styles.vehicleStatLabel}>km p/ revisão</Text>
                </View>
                <View style={styles.vehicleStatDivider} />
                <View style={styles.vehicleStat}>
                  <Text style={styles.vehicleStatValue}>
                    {recentServices.length}
                  </Text>
                  <Text style={styles.vehicleStatLabel}>serviços</Text>
                </View>
              </View>

              {mileageStatus && (
                <View style={styles.mileageStatusRow}>
                  <StatusBadge
                    label={mileageStatus.label}
                    variant={mileageStatus.variant}
                  />
                </View>
              )}

              {/* VIN */}
              <View style={styles.vinRow}>
                <Text style={styles.vinLabel}>VIN/Chassi</Text>
                <Text style={styles.vinValue}>{activeVehicle.vin}</Text>
              </View>
            </Card>
          )}

          {/* ─── Ações Rápidas ──────────────────────────────────────── */}
          <SectionHeader title="Ações rápidas" />
          <View style={styles.quickActions}>
            {[
              { icon: '📅', label: 'Agendar\nManutenção', screen: 'Appointments' },
              { icon: '🔧', label: 'Histórico\nde Serviços', screen: 'ServiceHistory' },
              { icon: '📍', label: 'Oficinas\nParceiras', screen: 'PartnerShops' },
              { icon: '📋', label: 'Meu\nVeículo', screen: 'Vehicle', params: activeVehicle ? { vehicleId: activeVehicle.id } : {} },
            ].map((action) => (
              <TouchableOpacity
                key={action.screen}
                style={styles.quickAction}
                onPress={() => onNavigate(action.screen, action.params)}
                activeOpacity={0.75}
              >
                <View style={styles.quickActionIcon}>
                  <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ─── Histórico Recente ───────────────────────────────────── */}
          {recentServices.length > 0 && (
            <>
              <SectionHeader
                title="Histórico recente"
                action={{ label: 'Ver tudo', onPress: () => onNavigate('ServiceHistory') }}
              />
              {recentServices.map((service) => (
                <Card key={service.id} style={styles.serviceCard} onPress={() => onNavigate('ServiceHistory')}>
                  <View style={styles.serviceRow}>
                    <View style={styles.serviceIconContainer}>
                      <Text style={styles.serviceEmoji}>🔧</Text>
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceType}>
                        {SERVICE_TYPE_LABELS[service.serviceType]}
                      </Text>
                      <Text style={styles.serviceShop}>{service.shopName}</Text>
                      <Text style={styles.serviceMeta}>
                        {service.mileageAtService.toLocaleString('pt-BR')} km ·{' '}
                        {new Date(service.completedAt ?? service.scheduledAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                    <View style={styles.serviceCostCol}>
                      <Text style={styles.serviceCost}>
                        R$ {service.totalCost.toFixed(2).replace('.', ',')}
                      </Text>
                      {service.fordVerified && (
                        <Text style={styles.fordVerified}>✓ Ford</Text>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* ─── Banner Ford Service Partner ─────────────────────────── */}
          <TouchableOpacity
            style={styles.bannerCard}
            onPress={() => onNavigate('PartnerShops')}
            activeOpacity={0.85}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTag}>FORD SERVICE PARTNER</Text>
              <Text style={styles.bannerTitle}>
                Oficinas credenciadas perto de você
              </Text>
              <Text style={styles.bannerSubtitle}>
                Peça genuína, preço tabelado e garantia da marca Ford na sua região.
              </Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Encontrar oficina →</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
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
  hero: {
    backgroundColor: Colors.fordBlue,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl + 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  logoFord: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    letterSpacing: 4,
  },
  logoNexus: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: '#A0B4CC',
    letterSpacing: 3,
  },
  greeting: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  notifButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notifIcon: {
    fontSize: 24,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: Colors.fordBlue,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
    marginTop: -Spacing.lg,
  },
  addVehicleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.fordBluePale,
    borderStyle: 'dashed',
    ...Shadows.md,
  },
  addVehicleIcon: { fontSize: 36 },
  addVehicleText: { flex: 1 },
  addVehicleTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.fordBlue,
  },
  addVehicleSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: Typography.sm * 1.5,
  },
  addVehicleArrow: {
    fontSize: 24,
    color: Colors.fordBlueLight,
    fontWeight: Typography.bold,
  },
  vehicleStatusCard: {
    gap: Spacing.md,
  },
  vehicleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleModel: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  vehicleYear: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  vehicleArrow: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: Typography.bold,
  },
  vehicleStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  vehicleStat: {
    flex: 1,
    alignItems: 'center',
  },
  vehicleStatValue: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.fordBlue,
  },
  vehicleStatLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  vehicleStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  mileageStatusRow: {
    flexDirection: 'row',
  },
  vinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  vinLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  vinValue: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.fordBlue,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.xs * 1.4,
  },
  serviceCard: {
    marginBottom: Spacing.sm,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.fordBluePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: { fontSize: 20 },
  serviceInfo: { flex: 1 },
  serviceType: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  serviceShop: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  serviceMeta: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  serviceCostCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  serviceCost: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  fordVerified: {
    fontSize: 10,
    color: Colors.fordBlue,
    fontWeight: Typography.semibold,
  },
  bannerCard: {
    backgroundColor: Colors.fordBlue,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  bannerContent: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#A0B4CC',
    letterSpacing: 2,
  },
  bannerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  bannerSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: Typography.sm * 1.5,
  },
  bannerButton: {
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: Colors.white,
    fontWeight: Typography.semibold,
    fontSize: Typography.sm,
  },
  bottomPad: { height: Spacing.xxl },
});

