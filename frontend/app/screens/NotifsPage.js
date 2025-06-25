import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getIncomingRequests, respondToFriendRequest, confirmFriendRequest } from '../services/FriendRequests';
import { FIREBASE_AUTH } from '../../firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { GoBackButton } from './FriendProfile';
import { useNavigation } from '@react-navigation/native';
import { resetNotificationCount } from '../services/Users';

const NotifsPage = () => {

    const navigation = useNavigation();
    
    const [requests, setRequests] = useState([]);
    const currentUser = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        if (!currentUser) {
          return;
        }

        const unsubscribe = getIncomingRequests(currentUser.uid, (data)=> {
            setRequests(data);
            resetNotificationCount(currentUser.uid)
          });

        return () => {
            unsubscribe(); // Clean up the listener on unmount
        }

}, [currentUser]);

      const handleRespond = async (requestId, accepted, currentUserId, otherUserId) => {
          try {
              await respondToFriendRequest(requestId, accepted);
              // Remove the request from state after action
              if (accepted) {
                  await confirmFriendRequest(currentUserId, otherUserId);
              }
              setRequests(prev => prev.filter(r => r.id !== requestId));
          } catch (error) {
              console.error('Failed to respond:', error);
          }
      };


    return (
        <View style={styles.container}>
        {requests.length === 0 ? (
            <Text style={styles.message}>No new notifications at the moment.</Text>
        ) : (
            requests.map(request => (
            <View key={request.id} style={styles.requestCard}>
                <Text>{request.fromUsername} sent you a friend request</Text>
                <View style={styles.actions}>

                <AcceptButton
                    onPress={() => handleRespond(request.id, true, currentUser.uid, request.from)}
                />

                <RejectButton
                    onPress={() => handleRespond(request.id, false, currentUser.uid, request.from)}
                />
                </View>
            </View>
            ))
        )}
        <GoBackButton style={styles.button} onPress={() => navigation.navigate('Me')} />
        </View>

    );
} 


export default NotifsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: '1%',
    paddingBottom: '5%',
  },
  requestCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // for Android shadow
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  accept: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // green
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  reject: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336', // red
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
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

const AcceptButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.accept}>
      <Ionicons name="checkmark" size={20} color="white" />
      <Text style={styles.actionText}>Accept</Text>
    </TouchableOpacity>
  );
};

const RejectButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.reject}>
      <Ionicons name="close" size={20} color="white" />
      <Text style={styles.actionText}>Reject</Text>
    </TouchableOpacity>
  );
};

