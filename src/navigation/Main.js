import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import LoginScreen from '../screens/LoginScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Stack = createStackNavigator();

const Main = () => {


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />  
          <Stack.Screen name="OrdersScreen" component={OrdersScreen}/>
    </Stack.Navigator>
  );
};

export default Main;