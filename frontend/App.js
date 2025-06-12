import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { use, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
/* React Native Imports */
import Login from './app/screens/Login';
import { ScoreReader, PitchChecker, Home, JianpuPage } from './app/screens';
/* Screens Imports */
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase-config'
/* Firebase Imports */;


const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();


function InsideTabs () {
  return (
    // <InsideStack.Navigator>
    //   <InsideStack.Screen name="Home" component={Home} />
    //   <InsideStack.Screen name="Read Score" component={ScoreReader} />
    //   <InsideStack.Screen name="Pitch" component={PitchChecker} />
    //   <InsideStack.Screen name="JianpuPage" component={JianpuPage} />
    // </InsideStack.Navigator>

    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Read Score') {
          iconName = focused ? 'barcode-outline' : 'barcode-outline';
        } else if (route.name === 'Pitch') {
          iconName = focused ? 'mic' : 'mic-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#888',
    })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Read Score" component={ScoreReader} />
      <Tab.Screen name="Pitch" component={PitchChecker} />
      <Tab.Screen name="JianpuPage" component={JianpuPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
  });
 },  []);

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'> 
          {user ? (
            <Stack.Screen 
            name='Inside' 
            component={InsideTabs} 
            options={{ headerShown: false }} />
          ) : 
          (<Stack.Screen 
          name='Login' 
          component={Login} 
          options={{ headerShown: false }} />) }
          {/* Add other screens here as needed */}
          </Stack.Navigator>
      </NavigationContainer>
  );
}


