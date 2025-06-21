import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';

const UserProfileView = ({
  username,
  bio,
  editable = false,
  onEdit,
  onSave,
  onChangeBio,
  friendsCount,
  uploadCount,
}) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: '3%' }}>
        <Image
          source={require('../../assets/default-pfp.jpg')}
          style={[styles.profileImage, { marginRight: '5%' }]}
        />
        <View style={{ flexDirection: 'column'}}>
          <Text style={[styles.username]}>{username}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <View style={{marginRight: '10%'}}>
            <Text style={styles.varText}>{uploadCount}</Text>
            <Text style={styles.infoText}>practices</Text>
            </View>
            <View>
              <Text style={styles.varText}>{friendsCount}</Text>
              <Text style={styles.infoText}>friends</Text>
            </View>
          </View>
        </View>
      </View>

      {editable && editMode ? (
        <>
          <SaveChangesButton onPress={() => { onSave(); setEditMode(false); }} />
          <TextInput
            value={bio}
            onChangeText={onChangeBio}
            placeholder="Set bio"
          />
        </>
      ) : (
        <View style={{ flexDirection: 'column', alignItems: 'left' }}>
          <Text style={[styles.bottomMargin, styles.bio, { marginHorizontal: '3%' }]}>
            {bio || 'No bio yet.'}
          </Text>

          {editable && (
            <View style={styles.buttonRow}>
              <EditProfileButton onPress={() => setEditMode(true)} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default UserProfileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'left',
    paddingTop: '6%',
    paddingHorizontal: '6%',
    justifyContent: 'flex-start'
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#007BFF',
    marginBottom: '5%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '5%',
    color: '#333',
  },
  bio: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: '8%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: '3%',
    borderRadius: 6,
    marginHorizontal: '1%',
    paddingHorizontal: '3%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomContainer: {
        position: 'absolute',
        bottom: '8%', // distance from bottom
        left: 0,
        right: 0,
        alignItems: 'center',
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
    marginBottom: '3%',
    fontWeight: 'bold'
  }
});


const EditProfileButton = ({ onPress }) => {
  return(
  <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Edit Profile</Text>
  </TouchableOpacity>
  )
}

const SaveChangesButton = ({ onPress }) => {
  return(
    <View style={styles.bottomContainer}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Save Changes</Text>
    </TouchableOpacity>
    </View>
  )
}