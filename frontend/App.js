import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
/* React Native Imports */
import { SplashScreen } from './app/screens/SplashScreen';
import Login from './app/screens/Login';
import Loading from './app/screens/Loading';
import { ScoreReader, PitchChecker, Home, JianpuPage } from './app/screens';
import { AuthContext, AuthProvider }from './app/screens/AuthContext';
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
    </Tab.Navigator>
  );
}


export default function App() {

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({state}) => (
          <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isLoading && state.error == null ? (
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : state.user == null ? (
              <Stack.Screen name="Login" component={Login} />
              // add Sign Up screen here 
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


