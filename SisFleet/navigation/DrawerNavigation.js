import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import BottomTabNavigation from './BottomTabNavigation';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Trips" component={BottomTabNavigation} />
      <Drawer.Screen name="Maintenance" component={MaintenanceScreen} />
    </Drawer.Navigator>
  );
}
