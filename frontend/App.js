  import { NavigationContainer, useNavigation } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import Ionicons from "@expo/vector-icons/Ionicons";
  import * as Font from 'expo-font';
  import { useContext, useEffect, useState } from 'react';
  import { Image, View, Text, TouchableOpacity } from 'react-native';

  /* Screens */
  import { SplashScreen } from './app/screens/SplashScreen';
  import { SignUpScreen } from './app/screens/SignUpScreen';
  import  Profile  from './app/screens/Profile'
  import NotifsPage from './app/screens/NotifsPage';
  import FriendSearch from './app/screens/FriendsSearch';
  import Login from './app/screens/Login';
  import Loading from './app/screens/Loading';
  import FriendProfile from './app/screens/FriendProfile';
  import { FriendsList } from './app/screens/FriendsList';
  import { ScoreReader, PitchChecker, Home, JianpuPage } from './app/screens';

  /* Auth & Context */
  import { AuthContext, AuthProvider }from './app/screens/AuthContext';
  import { FIREBASE_AUTH } from './firebase-config';
import { LogoutButton } from './app/screens/Home';


  // import PitchDetector from "./modules/pitch-detector/src/PitchDetectorModule"


  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const SocialsStack = createNativeStackNavigator();
  const ProfileStack = createNativeStackNavigator();

  function LogoTitle() {
    const navigation = useNavigation();
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width:'100%', paddingHorizontal: '2%'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('./assets/Noteworthy-Icon.png')}
            style={{resizeMode: 'contain', alignItems: 'center' , width: 150, height: 150}}
          />
        </TouchableOpacity>
        <LogoutButton style={{marginTop: '3%'}} onPress={() => FIREBASE_AUTH.signOut()}/>
      </View>
    );
  }

  function ProfileStackScreen() {
    return (
      <ProfileStack.Navigator screenOptions={{headerShown: false}}>
        <ProfileStack.Screen name="Me" component={Profile} />
        <ProfileStack.Screen name="FriendsList" component={FriendsList} />
        <ProfileStack.Screen name="Notifications" component={NotifsPage} />
      </ProfileStack.Navigator>
    );
  }

  function SocialsStackScreen() {
    return(
      <SocialsStack.Navigator screenOptions={{headerShown: false}}>
        <SocialsStack.Screen name="FriendsList" component={FriendSearch} /> 
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
        headerTitle: (props) => <LogoTitle {...props} />,
        alignItems: 'center',
      })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Read Score" component={ScoreReader} />
        <Tab.Screen name="Pitch" component={PitchChecker} />
        <Tab.Screen name="Socials" component={SocialsStackScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
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
              <Stack.Screen name="JianpuPage" component={JianpuPage} />
              
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

// function SignOutButton({onPress}) {
//   return(
//     <TouchableOpacity style={st} onPress={onPress}>
//       <Ionicons name='log-out-ouline' size={20} color="white" />
//       <Text>Sign Out?</Text>
//     </TouchableOpacity>
//   )
// }