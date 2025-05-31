import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebase-config';



const Home = ( { navigation }) => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
            <Button title='Pitch Checker' onPress={() => navigation.navigate('Pitch')} />
            <Button title='Read Score' onPress={() => navigation.navigate('Read Score')} />
            <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    );
}

export default Home;