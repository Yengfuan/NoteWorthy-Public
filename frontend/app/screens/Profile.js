import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import React, {use, useEffect, useState} from 'react';
import { listenToUserData, updateUserProfile } from '../services/Users';
import { FIREBASE_AUTH } from '../../firebase-config';
import UserProfileView from './UserProfileView';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LogoutButton } from './Home';




const Profile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const user = FIREBASE_AUTH.currentUser;


  const navigation = useNavigation();

  useEffect(() => {
  if (!user) return;

  // Listen for real-time user data updates
  const unsubscribeUser = listenToUserData(user.uid, (data) => {
    if (data) {
      setUsername(data.username);
      setBio(data.bio || '');
      setFriendsCount(data.friendsCount || 0);
      setUploadCount(data.uploadCount || 0);
    }
  });

  // Fetch friend requests count once (or you can add a listener too)
  const fetchRequestsCount = async () => {
    const requests = await getIncomingRequests(user.uid);
    console.log('Incoming requests:', requests.length);
    setFriendRequestsCount(requests.length);
  };
  fetchRequestsCount();

  // Cleanup listener on unmount
  return () => {
    unsubscribeUser();
  };
}, [user]);

  const handleSave = async () => {
    if (user) {
      console.log()
      await updateUserProfile(user.uid, { bio });
      console.log('Profile updated.');
    }
  };

  return (
    <View style={{flex:1}}>
      <UserProfileView
      username={username}
      bio={bio}
      editable={true}
      onChangeBio={setBio}
      onSave={handleSave}
      onPress={() => navigation.navigate('FriendsList')}
      friendsCount={friendsCount}
      uploadCount={uploadCount} 
      />

      <LogoutButton onPress={() => FIREBASE_AUTH.signOut()} style={styles.topRight} />

      <NotifsButton 
      onPress={() => navigation.navigate('Notifications')} 
      count={friendRequestsCount} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 6,
    },
    bottomRight: {
      position: 'absolute',
      bottom: "15%",  // Distance from bottom edge
      right: "3%",   // Distance from right edge
    },
    topRight: {
      position: 'absolute',
      top: "2%",  // Distance from bottom edge
      right: "30%",   // Distance from right edge
    },
    iconWrapper: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // ensure it’s on top
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

});

const NotifsButton = ({ onPress, count }) => {
  return (
    <View style={styles.bottomRight}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {/* Wrapper with relative positioning */}
        <View style={styles.iconWrapper}>
          <Ionicons name="notifications-outline" size={28} color="grey" />
          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

