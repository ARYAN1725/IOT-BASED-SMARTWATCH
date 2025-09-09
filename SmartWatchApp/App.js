import 'react-native-gesture-handler'; // MUST be at the top
import { StyleSheet } from 'react-native';
import React from 'react';
import Dashboard from './src/screens/dashboard';
import Profile from './src/screens/profile';
import Analytics from './src/screens/analytics';
import Guide from './src/screens/guide';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import './src/config/firebase';

// Screen names
const homeName = "Dashboard";
const profileName = "Profile";
const analyticsName = "Analytics";
const guideName = "Guide";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tabs (your old Tab.Navigator)
const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === profileName) {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === analyticsName) {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === guideName) {
            iconName = focused ? 'book' : 'book-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { paddingBottom: 10, paddingTop: 10, fontSize: 10 },
        tabBarStyle: { padding: 15, height: 70 },
      })}
    >
      <Tab.Screen name={homeName} component={Dashboard} />
      <Tab.Screen name={profileName} component={Profile} />
      <Tab.Screen name={analyticsName} component={Analytics} />
      <Tab.Screen name={guideName} component={Guide} />
    </Tab.Navigator>
  );
};

// Main App
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false, unmountOnBlur: true }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
