import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, {useEffect, useState} from 'react';
import { fetchUserData, updateUserProfile } from '../services/Users';
import { FIREBASE_AUTH } from '../../firebase-config';
import UserProfileView from './UserProfileView';

// const Profile = () => {

//     const [username, setUsername] = useState('');
//     const [bio, setBio] = useState('');
//     const [editProfile, setEditProfile] = useState('');
//     const [editMode, setEditMode] = useState(false);


//     useEffect(() => {
//         const loadUser = async () => {
//             try {
//                 const data = await fetchUserData();
//                 if (data) {
//                     setUsername(data.username);
//                 }
//             } catch (e) {
//                 console.error("Failed to load user:", e)
//             }
//         }
//         loadUser();
//     }, []);

//     const handleSaveProfile = async () => {
//       try {
//         const user = FIREBASE_AUTH.currentUser;
//         if (user) {
//           await updateUserProfile(user.uid, { bio });
//         }
//         setEditProfile(false);
//         setEditMode(false);
//         console.log("Profile updated successfully")
//       } catch (e) {
//         console.error("Failed to update profile", e);
//       }
//     };


//     return (
//         <View style={styles.container}>
//           <View style={{flexDirection: 'row'}}>
//             <Image source={require('../../assets/default-pfp.jpg')} style={[styles.profileImage, {marginRight: '5%'}]} />
//             <Text style={[styles.username, {marginTop: '2%'}]}>{username}</Text>
//           </View>


              

//               {editMode ? (
//                 <>
//                 <SaveChangesButton onPress={handleSaveProfile} />
//                 <TextInput value={bio} onChangeText={(text) => setBio(text)} placeholder='Set bio'/>
//                 </>
//               ) : (
//                 <View style={{flexDirection: 'column', alignItems: 'left'}}>
//                   {bio == ''
//                   ?
//                   <Text style={[styles.bottomMargin, {marginHorizontal: '3%', color: '#666'}]} >Set bio</Text>
//                   :
//                   <Text style={[styles.bottomMargin, styles.bio, {marginHorizontal: '3%'}]} >{ bio }</Text>}

//                   <View style={styles.buttonRow}>
//                     <EditProfileButton onPress={() => setEditMode(true)} />

//                   </View>
//                 </View>
//               )}
//         </View>
//     )
// }


const Profile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUserData();
      if (data) {
        setUsername(data.username);
        setBio(data.bio || '');
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
    <UserProfileView
      username={username}
      bio={bio}
      editable={true}
      onChangeBio={setBio}
      onSave={handleSave}
    />
  );
};

export default Profile;

