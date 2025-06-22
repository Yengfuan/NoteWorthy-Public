import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import React, {use, useEffect, useState} from 'react';
import { fetchUserData, updateUserProfile } from '../services/Users';
import { FIREBASE_AUTH } from '../../firebase-config';
import UserProfileView from './UserProfileView';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const Profile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const user = FIREBASE_AUTH.currentUser;


  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUserData();
      if (data) {
        setUsername(data.username);
        setBio(data.bio || '');
        setFriendsCount(data.friendsCount || 0);
        setUploadCount(data.uploadCount || 0);
      }
      
      if (user) {
        const requests = await getIncomingRequests(user.uid);
        console.log('Incoming requests:', requests.length);
        setFriendRequestsCount(requests.length);
      }

    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (user) {
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
      friendsCount={friendsCount}
      uploadCount={uploadCount} 
      />
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
      bottom: "3%",  // Distance from bottom edge
      right: "3%",   // Distance from right edge
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

