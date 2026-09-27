import React, { useState, useCallback } from 'react';
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
import { ScreenHeader } from '../components/ScreenHeader';
import { Card, InfoRow, Divider } from '../components/Card';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { updateUserPhone } from '../services/userService';

type Props = {
  onBack: () => void;
};

export function ProfileScreen({ onBack }: Props): JSX.Element {
  const { user, logout, setUser } = useAuthContext();
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const handleSavePhone = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserPhone(user.uid, phone);
      setUser({ ...user, phone });
      setEditingPhone(false);
      Alert.alert('Salvo!', 'Telefone atualizado com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o telefone.');
    } finally {
      setSaving(false);
    }
  }, [user, phone, setUser]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  }, [logout]);

  if (!user) return <View />;

  const providerLabel = {
    password: 'E-mail e senha',
    google: 'Google',
    apple: 'Apple ID',
  }[user.provider];

  const roleLabel = {
    owner: 'Proprietário de veículo',
    dealer: 'Concessionária Ford',
    partner: 'Oficina Ford Service Partner',
  }[user.role];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Meu Perfil" onBack={onBack} variant="ford" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* ─── Avatar ─────────────────────────────────────────── */}
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{roleLabel}</Text>
              <View style={styles.providerBadge}>
                <Text style={styles.providerBadgeText}>
                  {user.provider === 'google' ? '🔵' : user.provider === 'apple' ? '' : '📧'} {providerLabel}
                </Text>
              </View>
            </View>

            {/* ─── Dados pessoais ─────────────────────────────────── */}
            <Card>
              <Text style={styles.sectionTitle}>Dados da conta</Text>
              <Divider margin="sm" />
              <InfoRow label="Nome" value={user.name} />
              <InfoRow label="E-mail" value={user.email ?? 'Não informado'} />
              <InfoRow label="Login" value={providerLabel} />

              <View style={styles.phoneRow}>
                <Text style={styles.phoneLabel}>Telefone</Text>
                {editingPhone ? (
                  <View style={styles.phoneEditRow}>
                    <TextInput
                      style={styles.phoneInput}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="(11) 99999-9999"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="phone-pad"
                      editable={!saving}
                    />
                    <TouchableOpacity
                      style={styles.phoneSaveBtn}
                      onPress={handleSavePhone}
                      disabled={saving}
                    >
                      <Text style={styles.phoneSaveBtnText}>{saving ? '...' : 'Salvar'}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setEditingPhone(true)} style={styles.phoneValueRow}>
                    <Text style={styles.phoneValue}>
                      {user.phone ?? 'Adicionar'}
                    </Text>
                    <Text style={styles.phoneEdit}>Editar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>

            {/* ─── Sobre o Ford Nexus ──────────────────────────────── */}
            <Card>
              <Text style={styles.sectionTitle}>Sobre o Ford Nexus</Text>
              <Divider margin="sm" />
              <InfoRow label="Versão" value="1.0.0 (Sprint 3)" />
              <InfoRow label="Projeto" value="Ford × FIAP · Engenharia de Software" />
              <InfoRow label="Equipe" value="Ana Clara · David · Lucas · Yasmim" />
            </Card>

            {/* ─── Ford Nexus Mission ──────────────────────────────── */}
            <View style={styles.missionCard}>
              <Text style={styles.missionTitle}>Nossa missão</Text>
              <Text style={styles.missionText}>
                "A Ford não precisa trazer o cliente de volta para a loja. Precisa chegar onde ele já está."
              </Text>
              <Text style={styles.missionSubtext}>
                Ford Nexus mantém o carro dentro do ecossistema Ford mesmo onde não existe mais concessionária.
              </Text>
            </View>

            {/* ─── Logout ─────────────────────────────────────────── */}
            <Button
              label="Sair da conta"
              onPress={handleLogout}
              variant="danger"
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
  safe: { flex: 1, backgroundColor: Colors.fordBlue },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    gap: Spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.fordBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  userRole: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  providerBadge: {
    backgroundColor: Colors.fordBluePale,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 4,
  },
  providerBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.fordBlue,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  phoneRow: {
    paddingVertical: Spacing.xs,
  },
  phoneLabel: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  phoneEditRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    height: 40,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
  },
  phoneSaveBtn: {
    backgroundColor: Colors.fordBlue,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  phoneSaveBtnText: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  phoneValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  phoneEdit: {
    fontSize: Typography.sm,
    color: Colors.fordBlueLight,
    fontWeight: Typography.semibold,
  },
  missionCard: {
    backgroundColor: Colors.fordBlue,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  missionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#A0B4CC',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  missionText: {
    fontSize: Typography.base,
    fontStyle: 'italic',
    color: Colors.white,
    lineHeight: Typography.base * 1.6,
  },
  missionSubtext: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: Typography.sm * 1.5,
  },
  bottomPad: { height: Spacing.xxl },
});
