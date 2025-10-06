import 'react-native-gesture-handler'; // MUST be at the top
// import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native'; // 👈 added View + ActivityIndicator
import { NavigationContainer ,DefaultTheme, DarkTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
// import * as NavigationBar from 'expo-navigation-bar';
import './src/config/firebase';
import React, { useEffect } from 'react';
import { Image } from "react-native";
import { TouchableOpacity } from 'react-native';
import { LogBox } from 'react-native';


// Screens
import Splash from './src/screens/Splash';
import Dashboard from './src/screens/dashboard';
import Profile from './src/screens/profile';
// import Analytics from './src/screens/analytics';
// import Guide from './src/screens/guide';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import BMIDetail from './src/screens/BMIDetail';
import PersonalDetails from './src/screens/PersonalDetails';
import StepsBlock from './src/screens/StepsBlock';




// Screen names
const homeName = "Dashboard";
const profileName = "Profile";
// const analyticsName = "Analytics";
// const guideName = "Guide";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tabs
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === homeName) {
            icon = require("./assets/heart.png");
          } else if (route.name === profileName) {
            icon = require("./assets/smart-watch.png");
          // } else if (route.name === analyticsName) {
          //   icon = require("./assets/heart.png");
          // } else if (route.name === guideName) {
            // icon = require("./assets/heart.png");
          }

          return (
            <Image
              source={icon}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
        tabBarStyle: { backgroundColor: "#202020", height: 70 },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "grey",
      })}
    >
      <Tab.Screen
        name={homeName}
        component={Dashboard}
        options={({ navigation }) => ({
        headerTitle: "SmartVitals",
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#202020" },
        headerTitleStyle: { color: "white", fontSize: 20 },
        headerTintColor: "white",
  })}
      />
      <Tab.Screen name={profileName} component={Profile} 
      options={({ navigation }) => ({
        headerTitle: "Profile",
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#202020" },
        headerTitleStyle: { color: "white", fontSize: 20 }
        })}
      />
      {/* <Tab.Screen name={analyticsName} component={Analytics} /> */}
      {/* <Tab.Screen name={guideName} component={Guide} /> */}
    </Tab.Navigator>
  );
};

// Main App
const App = () => {
  const [fontsLoaded] = useFonts({
    WorkSansExtraBoldItalic: require('./assets/fonts/WorkSans-ExtraBoldItalic.ttf'),
  });

  LogBox.ignoreAllLogs(true);


  // Show loading spinner until font is ready
  if (!fontsLoaded) {
    return null;
  }

  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false, unmountOnBlur: true }} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetails} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen
  name="BMIDetail"
  component={BMIDetail}  
  options={{ headerShown: true, title: 'BMI Details' }}
/>
<Stack.Screen
  name="StepsBlock"
  component={StepsBlock}  
  options={{ headerShown: true, title: 'StepsBlock' }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
