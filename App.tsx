import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// ─── Providers ───────────────────────────────────────────────────────────────
import { AuthProvider, useAuthContext } from './src/contexts/AuthContext';
import { VehicleProvider } from './src/contexts/VehicleContext';

// ─── Telas ───────────────────────────────────────────────────────────────────
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { VehicleScreen } from './src/screens/VehicleScreen';
import { ServiceHistoryScreen } from './src/screens/ServiceHistoryScreen';
import { AppointmentScreen } from './src/screens/AppointmentScreen';
import { PartnerShopsScreen } from './src/screens/PartnerShopsScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { Loading } from './src/components/Loading';

// ─── Design System ───────────────────────────────────────────────────────────
import { Colors, Typography, Spacing, Radius, Shadows } from './src/constants/theme';

// ─── Tipos de Tela ────────────────────────────────────────────────────────────
type ScreenName =
  | 'Home'
  | 'Vehicle'
  | 'AddVehicle'
  | 'ServiceHistory'
  | 'Appointments'
  | 'PartnerShops'
  | 'Notifications'
  | 'Profile';

type TabName = 'Home' | 'Vehicle' | 'Appointments' | 'PartnerShops' | 'Profile';

type NavigationState = {
  screen: ScreenName;
  params?: Record<string, unknown>;
};

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

const TABS: Array<{ key: TabName; label: string; icon: string }> = [
  { key: 'Home', label: 'Início', icon: '🏠' },
  { key: 'Vehicle', label: 'Veículo', icon: '🚗' },
  { key: 'Appointments', label: 'Agendar', icon: '📅' },
  { key: 'PartnerShops', label: 'Oficinas', icon: '🔧' },
  { key: 'Profile', label: 'Perfil', icon: '👤' },
];

function BottomTabBar({
  active,
  onPress,
}: {
  active: TabName;
  onPress: (tab: TabName) => void;
}): JSX.Element {
  return (
    <View style={tabStyles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyles.tab}
            onPress={() => onPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.icon, isActive && tabStyles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={tabStyles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...Shadows.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  icon: {
    fontSize: 22,
    opacity: 0.4,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: Colors.tabInactive,
    marginTop: 2,
    fontWeight: Typography.medium,
  },
  labelActive: {
    color: Colors.tabActive,
    fontWeight: Typography.bold,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.tabActive,
  },
});

// ─── App Navigator ─────────────────────────────────────────────────────────

function AppNavigator(): JSX.Element {
  const { user, loading } = useAuthContext();
  const [navState, setNavState] = useState<NavigationState>({ screen: 'Home' });
  const [activeTab, setActiveTab] = useState<TabName>('Home');

  const navigate = useCallback((screen: string, params?: Record<string, unknown>) => {
    setNavState({ screen: screen as ScreenName, params });
    // Sync tab if navigating to a tab-root screen
    if (['Home', 'Vehicle', 'Appointments', 'PartnerShops', 'Profile'].includes(screen)) {
      setActiveTab(screen as TabName);
    }
  }, []);

  const goBack = useCallback(() => {
    // Return to the active tab's root screen
    setNavState({ screen: activeTab });
  }, [activeTab]);

  const handleTabPress = useCallback((tab: TabName) => {
    setActiveTab(tab);
    setNavState({ screen: tab });
  }, []);

  if (loading) return <Loading fullScreen />;
  if (!user) return <LoginScreen />;

  const isModalScreen = ['Notifications'].includes(navState.screen);
  const showTabBar = !isModalScreen;

  const renderScreen = () => {
    switch (navState.screen) {
      case 'Home':
        return <HomeScreen onNavigate={navigate} />;

      case 'Vehicle':
      case 'AddVehicle':
        return (
          <VehicleScreen
            vehicleId={navState.params?.vehicleId as string | undefined}
            onBack={goBack}
            onNavigate={navigate}
          />
        );

      case 'ServiceHistory':
        return (
          <ServiceHistoryScreen
            onBack={goBack}
            vehicleId={navState.params?.vehicleId as string | undefined}
          />
        );

      case 'Appointments':
        return (
          <AppointmentScreen
            onBack={goBack}
            onNavigate={navigate}
            vehicleId={navState.params?.vehicleId as string | undefined}
          />
        );

      case 'PartnerShops':
        return <PartnerShopsScreen onBack={goBack} onNavigate={navigate} />;

      case 'Notifications':
        return <NotificationsScreen onBack={goBack} />;

      case 'Profile':
        return <ProfileScreen onBack={goBack} />;

      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      {showTabBar && (
        <BottomTabBar active={activeTab} onPress={handleTabPress} />
      )}
    </View>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <VehicleProvider>
          <ExpoStatusBar style="light" backgroundColor={Colors.fordBlue} />
          <AppNavigator />
        </VehicleProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
