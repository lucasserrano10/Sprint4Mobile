import { ref, set, get, push, query, orderByChild, equalTo, DataSnapshot } from 'firebase/database';
import { database } from './firebase';
import { AppNotification } from '../types/vehicle';

export async function getNotificationsByUser(userId: string): Promise<AppNotification[]> {
  const q = query(
    ref(database, 'notifications'),
    orderByChild('userId'),
    equalTo(userId)
  );

  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  const notifications: AppNotification[] = [];
  snapshot.forEach((child: DataSnapshot) => {
    notifications.push({ id: child.key as string, ...child.val() });
  });

  return notifications.sort((a, b) => b.createdAt - a.createdAt);
}

export async function createNotification(
  data: Omit<AppNotification, 'id'>
): Promise<AppNotification> {
  const notifRef = ref(database, 'notifications');
  const newRef = push(notifRef);

  const notification: AppNotification = {
    id: newRef.key as string,
    ...data,
  };

  await set(newRef, notification);
  return notification;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const readRef = ref(database, `notifications/${notificationId}/read`);
  await set(readRef, true);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const notifications = await getNotificationsByUser(userId);
  const unread = notifications.filter((n) => !n.read);

  await Promise.all(
    unread.map((n) => {
      const readRef = ref(database, `notifications/${n.id}/read`);
      return set(readRef, true);
    })
  );
}

// ─── Notificações mock para demonstração ─────────────────────────────────────

export function getMockNotifications(userId: string): AppNotification[] {
  return [
    {
      id: 'notif_001',
      userId,
      type: 'service_reminder',
      title: 'Revisão pendente',
      body: 'Seu Ford Ka está próximo dos 60.000 km. Agende sua revisão na rede Ford.',
      read: false,
      data: { vehicleId: 'vehicle_001' },
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 'notif_002',
      userId,
      type: 'appointment_confirmed',
      title: 'Agendamento confirmado!',
      body: 'Sua revisão na Auto Ford Sorocaba foi confirmada para amanhã às 9h.',
      read: false,
      data: { appointmentId: 'apt_001' },
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      id: 'notif_003',
      userId,
      type: 'service_completed',
      title: 'Serviço concluído',
      body: 'A troca de óleo do seu Ford Ka foi concluída com sucesso.',
      read: true,
      data: { serviceId: 'svc_002' },
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'notif_004',
      userId,
      type: 'recall_alert',
      title: 'Alerta de Recall Ford',
      body: 'Verifique se seu veículo está incluso no recall #2024-001 para inspeção do airbag.',
      read: true,
      data: {},
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
  ];
}
