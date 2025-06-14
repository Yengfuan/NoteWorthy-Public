import {View, Image, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebase-config';
import JianpuChord from './JianpuChord';
import JianpuNoteSVG from './JianpuNote';
import Ionicons from "@expo/vector-icons/Ionicons";


const Home = ( { navigation }) => {
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <ReadScoreButton onPress={() => navigation.navigate('Read Score')} />
                <PitchCheckerButton onPress={() => navigation.navigate('Pitch')} />
            </View>
            <LogoutButton onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    );
}

const PitchCheckerButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Ionicons name="mic" size={24} color="white" />
                <Text style={styles.buttonText}>Check Pitch</Text>
            </View>
        </TouchableOpacity>
    );
}

const ReadScoreButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Ionicons name="barcode-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Read Score</Text>
            </View>
        </TouchableOpacity>
    );
}

const LogoutButton = ({ onPress }) => {
    return (
        <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Ionicons name="log-out-outline" size={30} color="white" />
                <Text style={styles.buttonText}>Log Out</Text>
            </View>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomContainer: {
        position: 'absolute',
        bottom: 30, // distance from bottom
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    }, 
});

export default Home;

