import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen'; // Correto: Importar LoginScreen
import HomeScreen from '../screens/HomeScreen';   // Correto: Importar HomeScreen
import DrawerNavigation from './DrawerNavigation';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="App" component={DrawerNavigation} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
