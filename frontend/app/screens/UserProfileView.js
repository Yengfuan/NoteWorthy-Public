import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const imageSize = Math.max(screenWidth * 0.25, 120);

const UserProfileView = ({
  username,
  bio,
  editable = false,
  onEdit,
  onSave,
  onChangeBio,
  friendsCount,
  uploadCount,
  onPress,
}) => {
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, position:'relative' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: '3%' }}>
        <Image
          source={require('../../assets/default-pfp.jpg')}
          style={[styles.profileImage, { marginRight: '5%' }]}
        />
        <View style={{ flexDirection: 'column'}}>
          <Text style={[styles.username]}>{username}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <View style={{marginRight: '20%'}}>
              <Text style={styles.varText}>{uploadCount}</Text>
              <Text style={styles.infoText}>practices</Text>
            </View>
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.varText}>{friendsCount}</Text>
              <Text style={styles.infoText}>friends</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 100, marginHorizontal: '5%'}}>
        <Text style={[styles.infoText, {fontSize:18}]}>Bio</Text>
        {editable && editMode ? (
          <>
            <TextInput
              value={bio}
              onChangeText={onChangeBio}
              placeholder="Set bio"
              multiline
              style={styles.bioInput}
            />
          </>
        ) : (
            <Text style={[styles.bio, {height: 'auto'}]}>
              {bio || 'No bio yet.'}
            </Text>
        )}
        </View>
    </ScrollView>

          {editable && (
              <View style={styles.bottomContainer}>
              {editMode ? (
                <SaveChangesButton onPress={() => { onSave(); setEditMode(false); }} />
              ) : (
                <EditProfileButton onPress={() => setEditMode(true)} />
          )}

              </View>
            )}
        </View>
  );
};

export default UserProfileView;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'flex-start',
    paddingTop: '6%', 
    paddingHorizontal: '6%',
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    borderWidth: 2,
    borderColor: '#007BFF',
    marginBottom: '5%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginHorizontal: '1.75%',
    marginTop: '1.4%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: '3%',
    borderRadius: 6,
    marginHorizontal: '1%',
    paddingHorizontal: '3%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomContainer: {
        position: 'absolute',
        bottom: '4%', // distance from bottom
        left: 0,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
  },
  bottomMargin: {
    marginBottom: '5%',
  },
  varText: {
    fontSize: 20,
    color: '#666',
    marginBottom: '3%',
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: '1.75%',
    marginBottom: '1%',
    fontWeight: 'bold'
  },
  bioInput: {
    width: '80%',
    height: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: '5%',
    fontSize: 16,
    textAlign: 'left',
    color: '#888',
  },
});


const EditProfileButton = ({ onPress }) => {
  return(
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="create-outline" size={28} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
  )
}

const SaveChangesButton = ({ onPress }) => {
  return(
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="heart-outline" size={28} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.buttonText}>Save Changes</Text>
    </TouchableOpacity>
  )
}