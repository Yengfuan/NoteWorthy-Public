import {View, Image, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, { use, useState, useRef, useEffect } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { getFriendsList, removeFriend } from '../services/Friends';
import { GoBackButton } from './FriendProfile';

import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH } from '../../firebase-config';


export function FriendsList() {

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const userID = FIREBASE_AUTH.currentUser?.uid;
    const navigation = useNavigation();

    const getFriends = async () => {
        try {
            setLoading(true);
            const friends = await getFriendsList(userID);
            console.log("Friends fetched:", friends);
            setResults(friends);
        } catch (error) {
            console.error("Error fetching friends:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async (friendID) => {
        try {
            await removeFriend(userID, friendID);
            setResults((prevResults) => prevResults.filter((friend) => friend.uid !== friendID));
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    useEffect(() => {
        getFriends();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={results}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.title}>Your Friends</Text>
                        <View style={styles.userItem}>
                            
                            <Text style={styles.username}>{item.username}</Text>
                            <RemoveButton onPress={() => handleRemoveFriend(item.uid)} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.title}>No friends yet!</Text>
                }
                refreshing={loading}
                onRefresh={getFriends}
                style={styles.list}
            />
            <GoBackButton style={styles.button} onPress={() => navigation.navigate("Me")} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: '5%',
        backgroundColor: '#ffffff',
        paddingTop: 30,
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: "2%",
        marginBottom: "5%",
        color: '#333',
    },
    list: {
        width: '95%',
        paddingHorizontal: 10,
    },
    userItem: {
        padding: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        borderRadius: 5,
        backgroundColor: '#F44336', //red
        alignItems: 'center',
        padding: 10,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    actionText: {
        color: 'white',
        marginLeft: 6,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        bottom: "5%",
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignSelf: 'center',
    },
});

const RemoveButton= ({ onPress }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity onPress={onPress} style={styles.removeButton}>
            <Text style={styles.actionText}>Remove Friend?</Text>
            <Ionicons name="trash-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
    </View>
);

