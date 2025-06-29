import {View, Text, TextInput, Image, StyleSheet, Button, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
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

    // const isUsernameTaken = async (username) => {
    //     const usersRef = collection(db, 'users');
    //     const q = query(usersRef, where('username_lowercase', '==', username.toLowerCase()));
    //     const snapshot = await getDocs(q);
    //     return !snapshot.empty; 
    // }

    const doPassWordsMatch = (password, confirmPass) => {
        return password == confirmPass;
    }

    const handleSignUp = async () => {
        
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

    const isDisabled = 
        (!username.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPass.trim() ||
        password !== confirmPass);

    useEffect(() => {
        setUserError('');
        setPassError('');

        if (!username.trim()) { 
            setUserError("Please enter a username!")
        }
        if (!email.trim()) {
            setUserError("Please enter an email!")
        };
        if (!password.trim() || !confirmPass.trim())  {
            setPassError("Please enter a password!")
        };
        if (!doPassWordsMatch(password, confirmPass))  {
            setPassError("Passwords do not match!")
        };
    })

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>

                <Image source={require('../../assets/Noteworthy-Icon.png')} style={{ width: '100%', height: '10%', resizeMode: 'contain' }} />

                <TextInput value={email} style={styles.input} placeholder="Email" placeholderTextColor="#999" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                <TextInput value={username} style={styles.input} placeholder='Username' placeholderTextColor="#999" autoCapitalize='none' onChangeText={(text) => setUsername(text)} />
                {userErr ? <Text style={{ color: 'red' }}>{userErr}</Text> : null}
 
                <TextInput value={password} style={styles.input} placeholder="Password" placeholderTextColor="#999" autoCapitalize='none' secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
                <TextInput value={confirmPass} style={styles.input} placeholder="Re-enter Password" placeholderTextColor="#999" autoCapitalize='none' secureTextEntry={true} onChangeText={(text) => setConfirmPass(text)}/>
                {passErr ? <Text style={{ color: 'red' }}>{passErr}</Text> : null}

                <CreateAccButton style={isDisabled ? styles.nonbutton : styles.button} disabled={isDisabled} onPress={handleSignUp}/>

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

const CreateAccButton = ({onPress, style, isDisabled}) => {
    return(
        <TouchableOpacity
        style={style}
        disabled={isDisabled}
        onPress={onPress}
        >
            <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
    );
}