import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicleContext } from '../contexts/VehicleContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { StatusBadge, FordVerifiedBadge, CertificationBadge } from '../components/Badges';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { ServiceRecord, ServiceType, ServiceStatus } from '../types/vehicle';
import { SERVICE_TYPE_LABELS } from '../constants/app';
import { MOCK_SERVICE_HISTORY } from '../constants/app';

type Props = {
  onBack: () => void;
  vehicleId?: string;
};

const STATUS_MAP: Record<ServiceStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  completed: { label: 'Concluído', variant: 'success' },
  in_progress: { label: 'Em andamento', variant: 'info' },
  scheduled: { label: 'Agendado', variant: 'warning' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

export function ServiceHistoryScreen({ onBack, vehicleId }: Props): JSX.Element {
  const { activeVehicle } = useVehicleContext();
  const [selectedFilter, setSelectedFilter] = useState<'all' | ServiceType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const vehicle = activeVehicle;
  const allHistory = MOCK_SERVICE_HISTORY;

  const filtered = selectedFilter === 'all'
    ? allHistory
    : allHistory.filter((s) => s.serviceType === selectedFilter);

  const totalSpent = allHistory.reduce((sum, s) => sum + s.totalCost, 0);
  const verifiedCount = allHistory.filter((s) => s.fordVerified).length;

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filterTypes: Array<{ key: 'all' | ServiceType; label: string }> = [
    { key: 'all', label: 'Todos' },
    { key: 'full_revision', label: 'Revisão' },
    { key: 'oil_change', label: 'Óleo' },
    { key: 'tire_rotation', label: 'Pneus' },
    { key: 'brake_inspection', label: 'Freios' },
    { key: 'diagnostic', label: 'Diagnóstico' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Histórico de Serviços"
        subtitle={vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Todos os veículos'}
        onBack={onBack}
        variant="ford"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ─── KPIs do Histórico ────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{allHistory.length}</Text>
              <Text style={styles.kpiLabel}>serviços</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>R$ {(totalSpent / 1000).toFixed(1)}k</Text>
              <Text style={styles.kpiLabel}>investido</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{verifiedCount}</Text>
              <Text style={styles.kpiLabel}>verificados Ford</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* ─── Filtros de Tipo ─────────────────────────────────────── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filterTypes.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  selectedFilter === f.key && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(f.key)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    selectedFilter === f.key && styles.filterLabelActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ─── Lista de Serviços ───────────────────────────────────── */}
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Não há registros para este filtro.
              </Text>
            </View>
          ) : (
            filtered.map((service) => {
              const isExpanded = expandedId === service.id;
              const statusInfo = STATUS_MAP[service.status];

              return (
                <Card key={service.id} style={styles.serviceCard} onPress={() => toggleExpand(service.id)}>
                  {/* ─ Header do Card ─ */}
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.serviceEmoji}>🔧</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.serviceTypeName}>
                        {SERVICE_TYPE_LABELS[service.serviceType]}
                      </Text>
                      <Text style={styles.shopName}>{service.shopName}</Text>
                      <Text style={styles.serviceMeta}>
                        {service.mileageAtService.toLocaleString('pt-BR')} km ·{' '}
                        {new Date(service.completedAt ?? service.scheduledAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.cost}>
                        R$ {service.totalCost.toFixed(2).replace('.', ',')}
                      </Text>
                      <StatusBadge label={statusInfo.label} variant={statusInfo.variant} small />
                      <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                    </View>
                  </View>

                  {/* ─ Detalhes expandidos ─ */}
                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <View style={styles.expandedDivider} />

                      <Text style={styles.expandedDescription}>
                        {service.description}
                      </Text>

                      <View style={styles.expandedDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Técnico responsável</Text>
                          <Text style={styles.detailValue}>{service.technician}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Peças genuínas</Text>
                          <Text style={styles.detailValue}>
                            {service.genuineParts ? '✓ Sim' : '✗ Não'}
                          </Text>
                        </View>
                        {service.notes && (
                          <View style={styles.noteSection}>
                            <Text style={styles.noteLabel}>📋 Observações</Text>
                            <Text style={styles.noteText}>{service.notes}</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.badgeRow}>
                        {service.shopType === 'dealer' ? (
                          <CertificationBadge certification="ford_dealer" small />
                        ) : (
                          <CertificationBadge certification="ford_service_partner" small />
                        )}
                        {service.fordVerified && <FordVerifiedBadge small />}
                      </View>
                    </View>
                  )}
                </Card>
              );
            })
          )}

          {/* ─── Nota de Transparência ──────────────────────────────── */}
          <View style={styles.transparencyNote}>
            <Text style={styles.transparencyIcon}>🔒</Text>
            <Text style={styles.transparencyText}>
              Cada serviço é registrado no VIN do veículo pela Ford. O histórico é imutável e verificável — valoriza seu carro na revenda, seguro e financiamento.
            </Text>
          </View>

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
  heroSection: {
    backgroundColor: Colors.fordBlue,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl + 8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  kpiValue: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  kpiLabel: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
    marginTop: -Spacing.md,
  },
  filterRow: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    paddingHorizontal: 2,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.fordBlue,
    borderColor: Colors.fordBlue,
  },
  filterLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  filterLabelActive: {
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  serviceCard: {
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.fordBluePale,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceEmoji: { fontSize: 20 },
  cardInfo: { flex: 1 },
  serviceTypeName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  shopName: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  serviceMeta: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  cost: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  expandIcon: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  expandedSection: {
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  expandedDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * 1.6,
  },
  expandedDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  noteSection: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: 3,
    marginTop: Spacing.xs,
  },
  noteLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  noteText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    lineHeight: Typography.xs * 1.5,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  transparencyNote: {
    flexDirection: 'row',
    backgroundColor: Colors.fordBluePale,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'flex-start',
  },
  transparencyIcon: { fontSize: 20, flexShrink: 0 },
  transparencyText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.fordBlue,
    lineHeight: Typography.xs * 1.6,
    fontWeight: Typography.medium,
  },
  bottomPad: { height: Spacing.xxl },
});
