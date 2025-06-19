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
                {/* <ProfileButton /> */}
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
                <Ionicons name="mic" size={24} color="white" />
                <Text style={styles.buttonText}>Check Pitch</Text>
        </TouchableOpacity>
    );
}

const ProfileButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name="person" size={20} color="white" />
            <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
    )
}

const ReadScoreButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
                <Ionicons name="barcode-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Read Score</Text>
        </TouchableOpacity>
    );
}

const LogoutButton = ({ onPress }) => {
    return (
        <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Log Out</Text>
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
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 6,
    }, 
});

export default Home;

