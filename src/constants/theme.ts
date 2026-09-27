/**
 * Ford Nexus — Design System Tokens
 * Paleta oficial inspirada na identidade Ford: azul profundo, branco, acentos de destaque.
 */

export const Colors = {
  // Primários Ford
  fordBlue: '#00274F',        // Azul Ford principal
  fordBlueMid: '#003A73',     // Azul médio
  fordBlueLight: '#0066CC',   // Azul ação
  fordBluePale: '#E8F0FB',    // Azul fundo suave

  // Neutros
  white: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F4F8',
  border: '#DDE3EC',
  borderLight: '#EFF2F7',

  // Texto
  textPrimary: '#0D1B2A',
  textSecondary: '#4A5568',
  textMuted: '#8898AA',
  textWhite: '#FFFFFF',

  // Semânticos
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF9C3',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Gradiente Ford
  gradientStart: '#00274F',
  gradientEnd: '#003A73',

  // Tab bar
  tabActive: '#0066CC',
  tabInactive: '#8898AA',
} as const;

export const Typography = {
  // Famílias
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',

  // Tamanhos
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  xxl: 26,
  xxxl: 32,
  display: 40,

  // Pesos
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,

  // Altura de linha
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  screen: 20,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
