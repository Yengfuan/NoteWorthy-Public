import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import { ScoreReader, PitchChecker, Home } from './app/screens';
import { use, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase-config';


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout () {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home" component={Home} />
      <InsideStack.Screen name="Read Score" component={ScoreReader} />
      <InsideStack.Screen name="Pitch" component={PitchChecker} />
    </InsideStack.Navigator>
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
            component={InsideLayout} 
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


