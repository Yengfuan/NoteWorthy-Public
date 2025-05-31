import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import React from 'react';

const PitchChecker = ({ navigation }) => {
    return (
        <View> 
            <Text>PitchChecker</Text>
            <Button title = "Home" onPress ={() => navigation.navigate('Home')} />
        </View>
    );
}

export default PitchChecker;