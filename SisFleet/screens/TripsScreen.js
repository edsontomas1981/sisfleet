import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IncomeTab from './IncomeTab';
import ExpensesTab from './ExpensesTab';

const Tab = createMaterialTopTabNavigator();

export default function TripsScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Income" component={IncomeTab} />
      <Tab.Screen name="Expenses" component={ExpensesTab} />
    </Tab.Navigator>
  );
}
