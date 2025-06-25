import UserProfileView from './UserProfileView';
import { getUserByUid } from '../services/Users'; 
import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { sendFriendRequest } from '../services/FriendRequests';
import { FIREBASE_AUTH } from '../../firebase-config';


const FriendProfile = ({ route }) => {

  const userID = FIREBASE_AUTH.currentUser?.uid; // Get the current user's ID
  const navigation = useNavigation();  
  const { uid } = route.params; // Get the friend's ID from route parameters
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);

  const handleFriendRequest = async () => {
    try {
      await sendFriendRequest(userID, uid);
      setFriendRequestSent(true);
      alert("Friend request sent successfully");
      console.log("Friend request sent successfully");
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  }

  useEffect(() => {
    const loadFriend = async () => {
      const data = await getUserByUid(uid); // A helper to fetch user by UID
      if (data) {
        setUsername(data.username);
        setBio(data.bio || '');
        setFriendsCount(data.friendsCount || 0);
        setUploadCount(data.uploadCount || 0);
      }
    };
    loadFriend();
  }, [uid]);

  return (
    <View style={{flex:1, justifyContent:'space-between', padding:'5%'}} >
        <UserProfileView
        username={username}
        bio={bio}
        editable={false}
        friendsCount={0}
        uploadCount={0} 
        />
        <View style={{flexDirection:'row', justifyContent: 'space-between'}} >
            <GoBackButton style={styles.button} Press={() => navigation.navigate('FriendsList')}/>
            { friendRequestSent ? 
                <TouchableOpacity style={[styles.button,  {backgroundColor: 'green' }]} disabled>
                    <Ionicons name="checkmark-circle-outline" size={24} color='white' />
                    <Text style={styles.buttonText}>Sent</Text>
                </TouchableOpacity>
            : 
            <FriendRequestButton onPress={handleFriendRequest}/>
            }
            
        </View>
    </View>
  );
};

export function GoBackButton({onPress, style}) {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Ionicons name="arrow-back-circle-outline" size={24} color='white' />
            <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
    )
}

const FriendRequestButton = ({onPress}) => {
    
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name="add-circle-outline" size={24} color='white' />
            <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        width: "40%"
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 6,
    },
});

export default FriendProfile;