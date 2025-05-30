import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebase-config';



const List = ( { navigation }) => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
            <Button title='Open Details' onPress={() => navigation.navigate('details')} />
            <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    );
}

export default List;