import {View, Image, Text, TextInput, Button, StyleSheet} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebase-config';
import JianpuChord from './JianpuChord';
import JianpuNoteSVG from './JianpuNote';


const Home = ( { navigation }) => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
            <Button title='Pitch Checker' onPress={() => navigation.navigate('Pitch')} />
            <Button title='Read Score' onPress={() => navigation.navigate('Read Score')} />
            <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
            <JianpuChord
                notes={[
                    { num: "1", isSharp: false, isFlat: true, dotsAbove: 0, dotsBelow: 2, dotted: 2 },
                    { num: "2", isSharp: false, isFlat: false, dotsAbove: 0, dotsBelow: 0, dotted: 0 },
                    { num: "3", isSharp: false, isFlat: false, dotsAbove: 0, dotsBelow: 1, dotted: 0 },
                    { num: "4", isSharp: false, isFlat: false, dotsAbove: 0, dotsBelow: 1, dotted: 0 },
                   
                ]}
                underline={2}
            />

        </View>
    );
}

export default Home;