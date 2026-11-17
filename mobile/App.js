import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import DashboardScreen from './src/screens/DashboardScreen';
import ActuatorsScreen from './src/screens/ActuatorsScreen';
import FaultsScreen from './src/screens/FaultsScreen';
import {colors} from './src/theme/colors';

const Tab = createBottomTabNavigator();
const icons = {Painel: 'speedometer-outline', Atuadores: 'options-outline', Alertas: 'warning-outline'};
const theme = {...DarkTheme, colors: {...DarkTheme.colors, background: colors.bg, card: colors.surface,
  text: colors.text, border: colors.border, primary: colors.accent}};

export default function App() {
  return <SafeAreaProvider>
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}} edges={['top', 'left', 'right']}>
      <NavigationContainer theme={theme}>
        <StatusBar style="light"/>
        <Tab.Navigator screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {backgroundColor: colors.surface, borderTopColor: colors.border},
          tabBarIcon: ({color, size}) => <Ionicons name={icons[route.name]} size={size} color={color}/>,
        })}>
          <Tab.Screen name="Painel" component={DashboardScreen}/>
          <Tab.Screen name="Atuadores" component={ActuatorsScreen}/>
          <Tab.Screen name="Alertas" component={FaultsScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  </SafeAreaProvider>;
}
