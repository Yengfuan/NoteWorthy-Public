import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { useState } from 'react';
// import LoginScreen from './LoginScreen'; will fix this soon


export default function App() {

  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  return (
    <View>
      <Image source={require('./assets/Noteworthy-Icon.png')} />
      
      {/* email */} 
      <TextInput 
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      /> 

      {/* password */} 
      <TextInput 
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true} // hides the password input
      /> 

      <Button title="Register" onPress={() => {}} /> 
      <Button title="Login" onPress={() => {}} />
      
      {/* add an onPress function later */}

      {/* <Text>{message}</Text> //will add this also once I fix the authentication*/}


    </View>
  );
}