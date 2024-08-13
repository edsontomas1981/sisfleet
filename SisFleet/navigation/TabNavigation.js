import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ExpensesTab from '../screens/ExpensesTab';
import IncomeTab from '../screens/IncomeTab';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import LoginScreen from '../screens/LoginScreen';
import TripsScreen from '../screens/TripsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const logo = require('../assets/images/2.png');

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Sair') {
            return <Ionicons name="exit" size={size} color={color} />;
          } else if (route.name === 'Despesas') {
            return <Ionicons name="trending-down" size={size} color={color} />;
          } else if (route.name === 'Agenda') {
            return <Ionicons name="calendar" size={size} color={color} />;
          } else if (route.name === 'Manutenção') {
            return <Ionicons name="settings" size={size} color={color} />;
          } else if (route.name === 'Viagens') {
            return <Ionicons name="bus" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#BFBFBF',
        tabBarStyle: {
          backgroundColor: '#384C58',  // Cor de fundo da barra
          borderTopWidth: 0,        // Remover borda superior
          elevation: 5,             // Sombra no Android
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Viagens" component={TripsScreen} />
      <Tab.Screen name="Agenda" component={IncomeTab} />
      <Tab.Screen name="Manutenção" component={MaintenanceScreen} />
      <Tab.Screen name="Sair" component={LoginScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
