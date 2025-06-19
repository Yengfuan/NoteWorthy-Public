import {View, Image, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, { use, useState, useRef, useEffect } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { searchUsersByUsername } from '../services/Users';
import { useNavigation } from '@react-navigation/native';


const FriendsList = () => {
    
    const navigation = useNavigation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async(username) => {
        try {
            setLoading(true)
            const users = await searchUsersByUsername(username);
            setResults(users);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    };


    return(
        <View style={styles.container}>
            <SearchBar onPress={handleSearch} />

            <FlatList
            data={results}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
        // Username match
          <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('FriendProfile', {uid: item.uid})}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )} 
        // No username match
        ListEmptyComponent={
            !loading && (
            <Text style={styles.emptyText}>No friends found</Text>
          )
        }
        refreshing={loading}
        onRefresh={() => handleSearch('')} //refresh list automatically
        style={styles.list}
        />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        backgroundColor: '#ffffff',
        paddingTop: 30,
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 5,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%'
    },
    textInput: {
        flex: 1,
        paddingVertical: 0
    },
    icon: {
        marginRight: 4,
    },
    list: {
        width: '90%',
        marginTop: 10,
    },
    userItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    username: {
        fontSize: 16,
    },
    emptyText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#999',
    },
});


export default FriendsList;

const SearchBar = ({ onPress }) => {

    const [username, setUsername] = useState('');
    const timeout = useRef(null);

    useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }

        timeout.current = setTimeout(() => {
            onPress(username);
        }, 500);

        return () => clearTimeout(timeout.current);
    }, [username])

    return (
        <View style={ styles.input } >
            <TextInput
            style= {styles.textInput}
            value={username} 
            placeholder='Search for friends!' 
            autoCapitalize='none' 
            onChangeText={setUsername} />
            <TouchableOpacity 
            style={styles.icon}
            onPress={() => onPress(username)} >
                <Ionicons name="search-outline" size={24} />
            </TouchableOpacity>
        </View>
    )
}
