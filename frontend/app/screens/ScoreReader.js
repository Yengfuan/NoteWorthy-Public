import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import React from 'react';

const ScoreReader = ({ navigation }) => {
    return (
        <View> 
            <Text>ScoreReader</Text>
            <Button title = "Home" onPress ={() => navigation.navigate('Home')} />
        </View>
    );
}

export default ScoreReader;