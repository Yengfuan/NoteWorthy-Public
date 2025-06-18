import {View, Text, TextInput, Image, StyleSheet, Button, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config'
import { createUserProfile } from '../services/Users';


console.log("Sign up loading")
    
export function SignUpScreen() {
    const { signUp } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [username, setUsername] = useState('');
    const [userErr, setUserError] = useState('');
    const [passErr, setPassError] = useState('');

    const isUsernameTaken = async (username) => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username_lowercase', '==', username.toLowerCase()));
        const snapshot = await getDocs(q);
        return !snapshot.empty; 
    }

    const doPassWordsMatch = (password, confirmPass) => {
        return password == confirmPass;
    }

    const handleSignUp = async () => {
        
        if (!username.trim()) return setUserError("Please enter a username!");
        if (!email.trim()) return setUserError("Please enter an email!");
        if (!password.trim() || !confirmPass.trim()) return setPassError("Please enter a password!");
        if (!doPassWordsMatch(password, confirmPass)) return setPassError("Passwords do not match!");


        // const taken = await isUsernameTaken(username);

        // if (taken) {
        //     setUserError("Your username is already taken!")
        //     return;
        // }
        setUserError('')
        setPassError('')
        
        try {
            const userCredential = await signUp(email, password);
            const user = userCredential?.user;

            if (user) {
                await createUserProfile(user.uid, {
                    email,
                    username,
                });
            }
        } catch (error) {
            console.error("Signup or profile creation failed:", error);
        }
    }

    const isDisabled = userErr || passErr || password != confirmPass;
    const ButtonComponent = isDisabled ? View : TouchableOpacity;
    const buttonStyle = isDisabled ? styles.nonbutton : styles.button;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>

                <Image source={require('../../assets/Noteworthy-Icon.png')} style={{ width: '100%', height: '10%', resizeMode: 'contain' }} />

                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                <TextInput value={username} style={styles.input} placeholder='Username' autoCapitalize='none' onChangeText={(text) => setUsername(text)} />
                {userErr ? <Text style={{ color: 'red' }}>{userErr}</Text> : null}

                <TextInput value={password} style={styles.input} placeholder="Password" autoCapitalize='none' secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
                <TextInput value={confirmPass} style={styles.input} placeholder="Re-enter Password" autoCapitalize='none' secureTextEntry={true} onChangeText={(text) => setConfirmPass(text)}/>
                {passErr ? <Text style={{ color: 'red' }}>{passErr}</Text> : null}

                <ButtonComponent style={buttonStyle} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </ButtonComponent>

        </View>
        </KeyboardAvoidingView>
    )
}


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
    nonbutton: {
        backgroundColor: '#808080',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
    }
});
