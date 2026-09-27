import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { CertificationBadge } from '../components/Badges';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { PartnerShop, ServiceType, ShopCertification } from '../types/vehicle';
import { MOCK_PARTNER_SHOPS, SERVICE_TYPE_LABELS, CERTIFICATION_LABELS } from '../constants/app';

type Props = {
  onBack: () => void;
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
};

type FilterCert = 'all' | ShopCertification;

export function PartnerShopsScreen({ onBack, onNavigate }: Props): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState<FilterCert>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedFilter === 'all'
    ? MOCK_PARTNER_SHOPS
    : MOCK_PARTNER_SHOPS.filter((s) => s.certification === selectedFilter);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleWhatsApp = useCallback((whatsapp: string, shopName: string) => {
    const message = encodeURIComponent(
      `Olá! Encontrei a ${shopName} pelo Ford Nexus e gostaria de agendar uma manutenção para meu veículo Ford.`
    );
    Linking.openURL(`https://wa.me/${whatsapp}?text=${message}`);
  }, []);

  const handlePhone = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
  }, []);

  const filters: Array<{ key: FilterCert; label: string }> = [
    { key: 'all', label: 'Todas' },
    { key: 'ford_dealer', label: 'Concessionárias' },
    { key: 'ford_service_partner', label: 'Service Partner' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Oficinas Parceiras"
        subtitle="Rede Ford na sua região"
        onBack={onBack}
        variant="ford"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ─── Hero Explicativo ─────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Ford Service Partner</Text>
          <Text style={styles.heroSubtitle}>
            Oficinas credenciadas pela Ford com peça genuína, preço tabelado e garantia da marca — mesmo onde não há concessionária.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{MOCK_PARTNER_SHOPS.filter((s) => s.certification === 'ford_dealer').length}</Text>
              <Text style={styles.heroStatLabel}>Concessionárias</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{MOCK_PARTNER_SHOPS.filter((s) => s.certification === 'ford_service_partner').length}</Text>
              <Text style={styles.heroStatLabel}>Service Partners</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>100%</Text>
              <Text style={styles.heroStatLabel}>Peça genuína</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* ─── Filtros ─────────────────────────────────────────────── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, selectedFilter === f.key && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f.key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterLabel, selectedFilter === f.key && styles.filterLabelActive]}>
                  {f.label} {selectedFilter === f.key && `(${filtered.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ─── Lista de Oficinas ───────────────────────────────────── */}
          {filtered.map((shop) => {
            const isExpanded = expandedId === shop.id;

            return (
              <Card key={shop.id} style={styles.shopCard} onPress={() => toggleExpand(shop.id)}>
                {/* ─ Header ─ */}
                <View style={styles.shopHeader}>
                  <View style={styles.shopIconContainer}>
                    <Text style={styles.shopIcon}>
                      {shop.certification === 'ford_dealer' ? '🏢' : '🔧'}
                    </Text>
                  </View>
                  <View style={styles.shopInfo}>
                    <Text style={styles.shopName}>{shop.name}</Text>
                    <Text style={styles.shopAddress}>
                      {shop.neighborhood}, {shop.city} · {shop.state}
                    </Text>
                    <View style={styles.shopMeta}>
                      <Text style={styles.shopRating}>⭐ {shop.rating}</Text>
                      <Text style={styles.shopSep}>·</Text>
                      <Text style={styles.shopReviews}>{shop.reviewCount} avaliações</Text>
                      <Text style={styles.shopSep}>·</Text>
                      <Text style={styles.shopDistance}>📍 {shop.distanceKm} km</Text>
                    </View>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </View>

                <CertificationBadge certification={shop.certification} small />

                {/* ─ Detalhes expandidos ─ */}
                {isExpanded && (
                  <View style={styles.expandedSection}>
                    <View style={styles.expandedDivider} />

                    {/* Endereço completo */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text style={styles.detailText}>{shop.address}, {shop.neighborhood}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>🕐</Text>
                      <Text style={styles.detailText}>{shop.openHours}</Text>
                    </View>
                    {shop.genuineParts && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>✓</Text>
                        <Text style={[styles.detailText, styles.genuineText]}>Peças genuínas Ford</Text>
                      </View>
                    )}

                    {/* Especialidades */}
                    <Text style={styles.specialtiesTitle}>Especialidades:</Text>
                    <View style={styles.specialtiesRow}>
                      {shop.specialties.slice(0, 4).map((sp) => (
                        <View key={sp} style={styles.specialtyChip}>
                          <Text style={styles.specialtyText}>{SERVICE_TYPE_LABELS[sp]}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Botões de contato */}
                    <View style={styles.contactButtons}>
                      <TouchableOpacity
                        style={[styles.contactButton, styles.whatsappButton]}
                        onPress={() => handleWhatsApp(shop.whatsapp, shop.name)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.contactButtonIcon}>💬</Text>
                        <Text style={styles.contactButtonText}>WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.contactButton, styles.phoneButton]}
                        onPress={() => handlePhone(shop.phone)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.contactButtonIcon}>📞</Text>
                        <Text style={[styles.contactButtonText, styles.phoneButtonText]}>{shop.phone}</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.scheduleButton}
                      onPress={() => onNavigate('Appointments', { shopId: shop.id })}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.scheduleButtonText}>Agendar nesta oficina →</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            );
          })}

          {/* ─── Banner Ford Service Partner ─────────────────────────── */}
          <View style={styles.partnerInfoCard}>
            <Text style={styles.partnerInfoTitle}>Como funciona o credenciamento?</Text>
            <Text style={styles.partnerInfoText}>
              A Ford credencia oficinas independentes nos bairros onde não há mais concessionária. Cada Service Partner passa por treinamento, usa peças genuínas, aplica preço tabelado e tem todos os serviços registrados no chassi do veículo.
            </Text>
            <View style={styles.partnerBenefits}>
              {[
                { icon: '🔩', text: 'Peça genuína Ford/Motorcraft' },
                { icon: '💰', text: 'Preço tabelado pela Ford' },
                { icon: '🛡️', text: 'Garantia chancelada Ford' },
                { icon: '📋', text: 'Registro no chassi (VIN)' },
              ].map((b) => (
                <View key={b.text} style={styles.benefitRow}>
                  <Text style={styles.benefitIcon}>{b.icon}</Text>
                  <Text style={styles.benefitText}>{b.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.fordBlue },
  container: { flex: 1, backgroundColor: Colors.background },
  heroSection: {
    backgroundColor: Colors.fordBlue,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl + 8,
    gap: Spacing.base,
  },
  heroTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  heroSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: Typography.sm * 1.5,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.white },
  heroStatLabel: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 2 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
    marginTop: -Spacing.md,
  },
  filterRow: { paddingVertical: Spacing.sm, gap: Spacing.sm, paddingHorizontal: 2 },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterChipActive: { backgroundColor: Colors.fordBlue, borderColor: Colors.fordBlue },
  filterLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  filterLabelActive: { color: Colors.white },
  shopCard: { gap: Spacing.md },
  shopHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  shopIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.fordBluePale,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  shopIcon: { fontSize: 22 },
  shopInfo: { flex: 1 },
  shopName: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  shopAddress: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  shopMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  shopRating: { fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.textPrimary },
  shopSep: { fontSize: Typography.xs, color: Colors.textMuted },
  shopReviews: { fontSize: Typography.xs, color: Colors.textMuted },
  shopDistance: { fontSize: Typography.xs, color: Colors.fordBlueLight, fontWeight: Typography.semibold },
  expandIcon: { fontSize: Typography.xs, color: Colors.textMuted, flexShrink: 0, paddingTop: 4 },
  expandedSection: { gap: Spacing.sm },
  expandedDivider: { height: 1, backgroundColor: Colors.borderLight },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  detailIcon: { fontSize: 14, width: 20, flexShrink: 0 },
  detailText: { fontSize: Typography.sm, color: Colors.textSecondary, flex: 1 },
  genuineText: { color: Colors.success, fontWeight: Typography.semibold },
  specialtiesTitle: { fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.textSecondary, marginTop: Spacing.xs },
  specialtiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  specialtyChip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  specialtyText: { fontSize: 10, color: Colors.textSecondary },
  contactButtons: { flexDirection: 'row', gap: Spacing.sm },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    gap: Spacing.xs,
  },
  whatsappButton: { backgroundColor: '#25D366' },
  phoneButton: { backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.border },
  contactButtonIcon: { fontSize: 16 },
  contactButtonText: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.white },
  phoneButtonText: { color: Colors.textPrimary },
  scheduleButton: {
    backgroundColor: Colors.fordBlue,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  scheduleButtonText: { color: Colors.white, fontSize: Typography.sm, fontWeight: Typography.semibold },
  partnerInfoCard: {
    backgroundColor: Colors.fordBluePale,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  partnerInfoTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.fordBlue },
  partnerInfoText: { fontSize: Typography.sm, color: Colors.fordBlueMid, lineHeight: Typography.sm * 1.5 },
  partnerBenefits: { gap: Spacing.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  benefitIcon: { fontSize: 18, width: 24 },
  benefitText: { fontSize: Typography.sm, color: Colors.fordBlue, fontWeight: Typography.medium },
  bottomPad: { height: Spacing.xxl },
});
