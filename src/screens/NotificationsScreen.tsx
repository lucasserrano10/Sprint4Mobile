import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../contexts/AuthContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { AppNotification, NotificationType } from '../types/vehicle';
import { getMockNotifications } from '../services/notificationService';
import { NOTIFICATION_TYPE_LABELS } from '../constants/app';

type Props = {
  onBack: () => void;
};

const TYPE_ICONS: Record<NotificationType, string> = {
  service_reminder: '🔧',
  appointment_confirmed: '✅',
  appointment_reminder: '📅',
  appointment_cancelled: '❌',
  recall_alert: '⚠️',
  service_completed: '✓',
  mileage_alert: '🚗',
};

const TYPE_VARIANTS: Record<NotificationType, string> = {
  service_reminder: Colors.info,
  appointment_confirmed: Colors.success,
  appointment_reminder: Colors.warning,
  appointment_cancelled: Colors.danger,
  recall_alert: Colors.danger,
  service_completed: Colors.success,
  mileage_alert: Colors.warning,
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `Há ${minutes} min`;
  if (hours < 24) return `Há ${hours}h`;
  return `Há ${days} dia${days > 1 ? 's' : ''}`;
}

export function NotificationsScreen({ onBack }: Props): JSX.Element {
  const { user } = useAuthContext();

  const notifications = user ? getMockNotifications(user.uid) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Notificações"
        subtitle={unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia'}
        onBack={onBack}
        variant="ford"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>Sem notificações</Text>
              <Text style={styles.emptySubtitle}>
                Você receberá alertas de manutenção, confirmações de agendamento e lembretes importantes aqui.
              </Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                activeOpacity={0.85}
                style={[styles.notifCard, notif.read && styles.notifCardRead]}
              >
                <View style={[styles.notifIconContainer, { backgroundColor: `${TYPE_VARIANTS[notif.type]}22` }]}>
                  <Text style={styles.notifIcon}>{TYPE_ICONS[notif.type]}</Text>
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifHeader}>
                    <Text style={[styles.notifTitle, notif.read && styles.notifTitleRead]}>
                      {notif.title}
                    </Text>
                    {!notif.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifBody}>{notif.body}</Text>
                  <Text style={styles.notifTime}>{timeAgo(notif.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.fordBlue },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.sm * 1.5,
    paddingHorizontal: Spacing.xl,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  notifCardRead: {
    opacity: 0.65,
  },
  notifIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifIcon: { fontSize: 20 },
  notifContent: { flex: 1, gap: 3 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  notifTitleRead: {
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.fordBlueLight,
    flexShrink: 0,
  },
  notifBody: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * 1.5,
  },
  notifTime: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  bottomPad: { height: Spacing.xxl },
});
