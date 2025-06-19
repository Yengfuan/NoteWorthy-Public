import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';

const UserProfileView = ({
  username,
  bio,
  editable = false,
  onEdit,
  onSave,
  onChangeBio,
}) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../assets/default-pfp.jpg')}
          style={[styles.profileImage, { marginRight: '5%' }]}
        />
        <Text style={[styles.username, { marginTop: '2%' }]}>{username}</Text>
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
    paddingTop: '20%',
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