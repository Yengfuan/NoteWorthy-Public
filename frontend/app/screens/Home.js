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

export function LogoutButton({ onPress, style }) {
    return (
        <View style={style}>
        <TouchableOpacity style={styles.logOut} onPress={onPress}>
                <Ionicons name="log-out-outline" size={20} color="white" />
                <Text style={[styles.buttonText, {fontSize: 12}]}>Sign Out?</Text>
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
    logOut: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 6,
    }, 
});

export default Home;

