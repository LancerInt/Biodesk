import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const theme = {
  colors: {
    primary: '#2E7D32',
    primaryDark: '#1B5E20',
    primaryLight: '#4CAF50',
    secondary: '#F57C00',
    secondaryLight: '#FFB74D',
    accent: '#00897B',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1B1B1B',
    textSecondary: '#616161',
    textLight: '#9E9E9E',
    textOnPrimary: '#FFFFFF',
    border: '#E0E0E0',
    divider: '#EEEEEE',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    category: {
      'Biocontrol': '#2E7D32',
      'Biostimulants & Biofertilizers': '#F57C00',
      'Home & Garden': '#7B1FA2',
      'Botanical Pesticide': '#4CAF50',
      'Microbial Pesticide': '#2196F3',
      'Biostimulant': '#FF9800',
      'Biofertilizer': '#9C27B0',
    },
    formulation: {
      EC: '#E91E63',
      WP: '#3F51B5',
      SC: '#009688',
    },
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700', letterSpacing: 0.25 },
    h2: { fontSize: 24, fontWeight: '700' },
    h3: { fontSize: 20, fontWeight: '600', letterSpacing: 0.15 },
    h4: { fontSize: 18, fontWeight: '600' },
    subtitle1: { fontSize: 16, fontWeight: '600', letterSpacing: 0.15 },
    subtitle2: { fontSize: 14, fontWeight: '600' },
    body1: { fontSize: 16, fontWeight: '400', letterSpacing: 0.5 },
    body2: { fontSize: 14, fontWeight: '400', letterSpacing: 0.25 },
    caption: { fontSize: 12, fontWeight: '400', letterSpacing: 0.4 },
    button: { fontSize: 14, fontWeight: '600', letterSpacing: 1.25, textTransform: 'uppercase' },
    overline: { fontSize: 10, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, round: 999 },
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 },
  },
  dimensions: { screenWidth: width, screenHeight: height, isTablet: width >= 768 },
};

export default theme;
