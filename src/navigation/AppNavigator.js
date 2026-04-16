import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TechnologyScreen from '../screens/TechnologyScreen';
import TechnologyDetailScreen from '../screens/TechnologyDetailScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import PortfolioDetailScreen from '../screens/PortfolioDetailScreen';
import SolutionsScreen from '../screens/SolutionsScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import VideosScreen from '../screens/VideosScreen';
import GalleryScreen from '../screens/GalleryScreen';
import LeadsScreen from '../screens/LeadsScreen';
import LeadFormScreen from '../screens/LeadFormScreen';
import MeetingsScreen from '../screens/MeetingsScreen';
import MeetingFormScreen from '../screens/MeetingFormScreen';
import MeetingAudioScreen from '../screens/MeetingAudioScreen';
import SyncScreen from '../screens/SyncScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';
import TechnologyComparisonScreen from '../screens/TechnologyComparisonScreen';
import LandingScreen from '../screens/LandingScreen';
import LeadImagesScreen from '../screens/LeadImagesScreen';
import LeadAudioScreen from '../screens/LeadAudioScreen';
import CertificatesScreen from '../screens/CertificatesScreen';
import CertificateViewerScreen from '../screens/CertificateViewerScreen';
import EcocertSelectScreen from '../screens/EcocertSelectScreen';
import PresentationViewerScreen from '../screens/PresentationViewerScreen';
import LiveScannerScreen from '../screens/LiveScannerScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}>
      <Stack.Screen name="Landing" component={LandingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Technology" component={TechnologyScreen} />
      <Stack.Screen name="TechnologyDetail" component={TechnologyDetailScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="PortfolioDetail" component={PortfolioDetailScreen} />
      <Stack.Screen name="Solutions" component={SolutionsScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Videos" component={VideosScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Leads" component={LeadsScreen} />
      <Stack.Screen name="LeadForm" component={LeadFormScreen} />
      <Stack.Screen name="LeadImages" component={LeadImagesScreen} />
      <Stack.Screen name="LeadAudio" component={LeadAudioScreen} />
      <Stack.Screen name="Meetings" component={MeetingsScreen} />
      <Stack.Screen name="MeetingForm" component={MeetingFormScreen} />
      <Stack.Screen name="MeetingAudio" component={MeetingAudioScreen} />
      <Stack.Screen name="Sync" component={SyncScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="TechnologyComparison" component={TechnologyComparisonScreen} />
      <Stack.Screen name="Certificates" component={CertificatesScreen} />
      <Stack.Screen name="CertificateViewer" component={CertificateViewerScreen} />
      <Stack.Screen name="EcocertSelect" component={EcocertSelectScreen} />
      <Stack.Screen name="PresentationViewer" component={PresentationViewerScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="LiveScanner" component={LiveScannerScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
