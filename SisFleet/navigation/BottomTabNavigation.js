import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IncomeTab from '../screens/IncomeTab';
import ExpensesTab from '../screens/ExpensesTab';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Income" component={IncomeTab} />
      <Tab.Screen name="Expenses" component={ExpensesTab} />
    </Tab.Navigator>
  );
}
