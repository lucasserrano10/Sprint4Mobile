import { ref, set, get, push, query, orderByChild, equalTo, DataSnapshot } from 'firebase/database';
import { database } from './firebase';
import { Appointment, AppointmentStatus } from '../types/vehicle';

// ─── Agendamentos ─────────────────────────────────────────────────────────────

export async function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'confirmedAt' | 'reminderSent'>
): Promise<Appointment> {
  const appointmentsRef = ref(database, 'appointments');
  const newRef = push(appointmentsRef);

  const appointment: Appointment = {
    id: newRef.key as string,
    createdAt: Date.now(),
    confirmedAt: null,
    reminderSent: false,
    ...data,
  };

  await set(newRef, appointment);
  return appointment;
}

export async function getAppointmentsByOwner(ownerId: string): Promise<Appointment[]> {
  const q = query(
    ref(database, 'appointments'),
    orderByChild('ownerId'),
    equalTo(ownerId)
  );

  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  const appointments: Appointment[] = [];
  snapshot.forEach((child: DataSnapshot) => {
    appointments.push({ id: child.key as string, ...child.val() });
  });

  return appointments.sort((a, b) => b.scheduledDate - a.scheduledDate);
}

export async function getAppointmentsByVehicle(vehicleId: string): Promise<Appointment[]> {
  const q = query(
    ref(database, 'appointments'),
    orderByChild('vehicleId'),
    equalTo(vehicleId)
  );

  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  const appointments: Appointment[] = [];
  snapshot.forEach((child: DataSnapshot) => {
    appointments.push({ id: child.key as string, ...child.val() });
  });

  return appointments.sort((a, b) => b.scheduledDate - a.scheduledDate);
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  const statusRef = ref(database, `appointments/${appointmentId}/status`);
  await set(statusRef, status);

  if (status === 'confirmed') {
    const confirmedRef = ref(database, `appointments/${appointmentId}/confirmedAt`);
    await set(confirmedRef, Date.now());
  }
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  await updateAppointmentStatus(appointmentId, 'cancelled');
}
