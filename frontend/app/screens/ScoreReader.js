import {View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Image} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";

const ScoreReader = ({ navigation }) => {
    const [key, setKey] = useState('');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');

    const pickFile = async () => {
        const res = await DocumentPicker.getDocumentAsync({
          type: "application/xml",
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (res.type !== 'cancel') {
          setFile(res);
        }
        
    };

    const uploadFile = async () => {
        if (!file || !key) {
          Alert.alert('Missing Input', 'Please provide both a file and a key.');
          return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: file.assets[0].uri,
            name: file.assets[0].name,
            type: '*/*',
        });
        formData.append('key', key);

        try {
            const response = await fetch('http://192.168.1.16:5001/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            });

            console.log('Response status:', response.status);
            const json = await response.json();
            console.log('Response JSON:', json);
      
            if (response.ok) {
              navigation.navigate('JianpuPage', { output: json.jianpu });
            } else {
              setResult(`Error: ${json.error}`);
            }
          } catch (err) {
            setResult(`Network error: ${err.message}`);
          }
        };



       
    
    
    return (
        <View style={styles.container} >
            <Text style={styles.title}>Score Reader</Text>

            <PickFileButton onPress={ pickFile }  />

            <Text style={styles.text}>Selected File: {file ? file.assets[0].name : 'None'}</Text>
    
            <TextInput
            placeholder="Enter base key (e.g., C4)"
            value={key}
            onChangeText={setKey}
            style={styles.input}
            />

            <JianpuButton onPress={ uploadFile } />

            <HomeButton onPress={ () => navigation.navigate('Home')} />
        </View>
          );

        }


export default ScoreReader;

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
  },
  
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#ffffff',
    gap: 20,
  },
  text: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  outputLabel: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  scroll: {
    marginTop: 10,
    maxHeight: 300,
    flexDirection : 'row',
  },
  bottomContainer: {
        position: 'absolute',
        bottom: 30, // distance from bottom
        left: 0,
        right: 0,
        alignItems: 'center',
    },
  button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
  buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
});

const HomeButton = ({ onPress }) => {
    return (
        <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
           <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Ionicons name="home" size={24} color="white" />
                <Text style={styles.buttonText}>Home</Text>
            </View>
        </TouchableOpacity>
        </View>
    );
}

const JianpuButton = ({onPress}) => {
  return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Convert to Jianpu</Text>
        </TouchableOpacity>
  )
}

const PickFileButton = ({onPress}) => {
  return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Pick Music File</Text>
        </TouchableOpacity>
  )
}