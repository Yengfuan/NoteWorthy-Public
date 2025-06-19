import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from 'expo-font';
import { useContext, useEffect, useState } from 'react';

/* Screens */
import { SplashScreen } from './app/screens/SplashScreen';
import { SignUpScreen } from './app/screens/SignUpScreen';
import  Profile  from './app/screens/Profile'
import FriendsList from './app/screens/FriendsList';
import Login from './app/screens/Login';
import Loading from './app/screens/Loading';
import FriendProfile from './app/screens/FriendProfile';
import { ScoreReader, PitchChecker, Home } from './app/screens';

/* Auth & Context */
import { AuthContext, AuthProvider }from './app/screens/AuthContext';

// import PitchDetector from "./modules/pitch-detector/src/PitchDetectorModule"




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SocialsStack = createNativeStackNavigator();

function SocialsStackScreen() {
  return(
    <SocialsStack.Navigator screenOptions={{headerShown: false}}>
      <SocialsStack.Screen name="FriendsList" component={FriendsList} /> 
      <SocialsStack.Screen name="FriendProfile" component={FriendProfile} />
    </SocialsStack.Navigator>
  )
}

function InsideTabs () {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {

        const iconMap = {
          'Home': ['home', 'home-outline'],
          'Read Score': ['barcode', 'barcode-outline'],
          'Pitch': ['mic', 'mic-outline'],
          'Socials': ['people', 'people-outline'],
          'Profile': ['person', 'person-outline']
        }

        const [focusedIcon, unfocusedIcon] = iconMap[route.name] || [];

        return <Ionicons name={focused ? focusedIcon : unfocusedIcon } size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#888',
      headerShown: false,
    })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Read Score" component={ScoreReader} />
      <Tab.Screen name="Pitch" component={PitchChecker} />
      <Tab.Screen name="Socials" component={SocialsStackScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { state } = useContext(AuthContext);

  if (state.isLoading && state.error == null) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {state.user == null ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Inside" component={InsideTabs} />
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
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
      <RootNavigator />
    </AuthProvider>
  );
}


