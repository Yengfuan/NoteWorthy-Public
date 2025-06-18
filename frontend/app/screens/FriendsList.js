import {View, Image, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";

const FriendsList = () => {
    return(
        <View style={styles.container}>
            <Text>Hello friends!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff',
        paddingTop: 50,
    }, 
})

export default FriendsList;