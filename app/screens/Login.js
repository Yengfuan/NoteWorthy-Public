import {View, Text, TextInput, Image, StyleSheet, Button, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const handleLogIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Login successful!');
        } catch (error) {
            console.log(error);
            alert('Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Sign up successful! Check your emails!');
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Image source={require('C:/Users/fengy/OneDrive/Desktop/noteworthy/assets/Noteworthy-Icon.png')}/>
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                <TextInput value={password} style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
            
                { loading ? (<ActivityIndicator size="large" color="#0000ff" />
                ) : (
                <>
                <Button title="Login" onPress={handleLogIn} />
                <Button title="Create Account" onPress={handleRegister} />
                </>
                )}
            </KeyboardAvoidingView>
        </View>
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
    }
});