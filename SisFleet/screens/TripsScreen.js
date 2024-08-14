import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import IncomeTab from './IncomeTab';
import ExpensesTab from './ExpensesTab';
import AbastecimentoTabs from './Abastecimentos';

const Tab = createMaterialTopTabNavigator();

export default function TripsScreen() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: ({ color }) => {
            let label;

            if (route.name === 'Fretes') {
              label = 'Fretes';
            } else if (route.name === 'Gastos') {
              label = 'Gastos';
            } else if (route.name === 'Abastecimentos') {
              label = 'Abastecimentos';
            }

            return (
              <View style={styles.tabLabelContainer}>
                <MaterialCommunityIcons name={route.name === 'Fretes' ? 'cash' : route.name === 'Gastos' ? 'currency-usd' : 'gas-station'} size={20} color={color} />
                <Text style={[styles.tabLabelText, { color }]} numberOfLines={1} >
                  {label}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: '#ffffff', // Cor do texto e ícone ativo
          tabBarInactiveTintColor: '#b0c4de', // Cor do texto e ícone inativo
          tabBarIndicatorStyle: {
            backgroundColor: '#ffffff',
            height: 6, // Altera a altura do indicador
            borderRadius: 10, // Arredonda os cantos do indicador
          },
          tabBarStyle: {
            backgroundColor: '#384C58', // Cor de fundo da barra de abas
          },
        })}
      >
        <Tab.Screen name="Fretes" component={IncomeTab} />
        <Tab.Screen name="Gastos" component={ExpensesTab} />
        <Tab.Screen name="Abastecimentos" component={AbastecimentoTabs} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 30,
  },
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    marginLeft: 5,
    fontSize: 11,
    flexShrink: 1,
  },
});
