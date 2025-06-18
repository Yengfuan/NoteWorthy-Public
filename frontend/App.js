import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from 'expo-font';
/* React Native Imports */
import { SplashScreen } from './app/screens/SplashScreen';
import { SignUpScreen } from './app/screens/SignUpScreen';
import FriendsList from './app/screens/FriendsList';
import Login from './app/screens/Login';
import Loading from './app/screens/Loading';
import { ScoreReader, PitchChecker, Home } from './app/screens';
import { AuthContext, AuthProvider }from './app/screens/AuthContext';
import { useEffect, useState } from 'react';
// import PitchDetector from "./modules/pitch-detector/src/PitchDetectorModule"
/* Screens Imports */



const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();


function InsideTabs () {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Read Score') {
          iconName = focused ? 'barcode' : 'barcode-outline';
        } else if (route.name === 'Pitch') {
          iconName = focused ? 'mic' : 'mic-outline';
        } else if (route.name === 'Socials') {
          iconName = focused ? 'people' : 'people-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#888',
      headerShown: false,
    })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Read Score" component={ScoreReader} />
      <Tab.Screen name="Pitch" component={PitchChecker} />
      <Tab.Screen name="Socials" component={FriendsList} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // ensure App Icons load
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...Ionicons.font, //Preload Ionicons
      });
      setFontsLoaded(true);
    }   

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Stack.Screen name="Splash" component={SplashScreen} /> 
  }

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({state}) => (
          <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isLoading && state.error == null ? (
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : state.user == null ? (
              <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            ) : (
              <>
              <Stack.Screen name="Splash" component={Loading} />
              <Stack.Screen name="Inside" component={InsideTabs} />
              {/* Sign In Successful */}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}  
      </AuthContext.Consumer>
    </AuthProvider>
  );
}


