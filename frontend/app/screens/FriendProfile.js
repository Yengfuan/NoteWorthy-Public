import UserProfileView from './UserProfileView';
import { getUserByUid } from '../services/Users'; 
import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';


const FriendProfile = ({ route }) => {

  const navigation = useNavigation();  
  const { uid } = route.params;
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const loadFriend = async () => {
      const data = await getUserByUid(uid); // A helper to fetch user by UID
      if (data) {
        setUsername(data.username);
        setBio(data.bio || '');
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
        />
        <View style={{flexDirection:'row', justifyContent: 'space-between'}} >
            <GoBackButton onPress={() => navigation.navigate('FriendsList')}/>
            <FriendRequestButton />
        </View>
    </View>
  );
};

const GoBackButton = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name="arrow-back-circle-outline" size={24} color='white' />
            <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
    )
}

const FriendRequestButton = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name="add-circle-outline" size={24} color='white' />
            <Text style={styles.buttonText}>Follow</Text>
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