import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, {useEffect, useState} from 'react';
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
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    const user = FIREBASE_AUTH.currentUser;
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
     <NotifsButton onPress={() => navigation.navigate('Notifications')} />
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
      bottom: 20,  // Distance from bottom edge
      right: 20,   // Distance from right edge
    },
  badge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },

});

const NotifsButton = ({onPress, count}) => {
  return (
    <View style={styles.bottomRight}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="notifications-outline" size={24} color='grey' />
      { count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
    </View>
  );
};