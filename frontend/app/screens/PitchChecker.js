import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Home from './Home';
import Ionicons from "@expo/vector-icons/Ionicons";
//import Pitchy from 'react-native-pitchy'

// import PitchDetectorModule from '../../modules/pitch-detector/src/PitchDetectorModule';

const PitchChecker = ({ navigation }) => {
    const [message, setMessage] = React.useState('');
    const [toggled, setToggled] = React.useState(false);

    const handleClick = () => {
        // Here you would typically call the native module to start pitch detection
        // PitchDetectorModule.startPitchDetection((result) => {
        //     setMessage(`Detected pitch: ${result}`);
        // }, (error) => {
        //     setMessage(`Error: ${error}`);
        // });
        setToggled(bool => !bool)
        toggled ? setMessage('') : setMessage('Detecting pitch...');
    }
    return (
        <View style={styles.container}>
            <PitchCheckerButton onPress={handleClick} toggled = {toggled}/>
            {message !== '' && (
                <Text style={{ marginTop: 20, fontSize: 16, color: '#333' }}>{message}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff',
        paddingTop: '1%',
    }, 
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
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
});

const PitchCheckerButton = ({ onPress, toggled }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: toggled ? '#FF4136' : '#007BFF' } 
            ]}
            onPress={onPress}
        >
            <Ionicons name="mic" size={50} color="white" />
        </TouchableOpacity>
    );
}



export default PitchChecker;