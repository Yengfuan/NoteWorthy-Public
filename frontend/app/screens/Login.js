import {View, Text, TextInput, Image, StyleSheet, Button, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';


console.log("Login loading")
    
const Login = () => {
    const { signIn, signUp } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>

                <Image source={require('../../assets/Noteworthy-Icon.png')} style={{ width: '100%', height: '10%', resizeMode: 'contain' }} />
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                <TextInput value={password} style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />

                <TouchableOpacity style={styles.button} onPress={() => signIn(email, password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => signUp(email, password)}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
        buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    }, 
});
