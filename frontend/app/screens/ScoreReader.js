import {View, Text, TextInput, Button, StyleSheet, ScrollView, Alert} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { React, useState } from 'react';

const ScoreReader = ({ navigation }) => {
    const [key, setKey] = useState('');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');

    const pickFile = async () => {
        const res = await DocumentPicker.getDocumentAsync({
          type: "application/xml",
          copyToCacheDirectory: true,
        });
        
        if (res.type === 'success') {
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
            uri: file.uri,
            name: file.name,
            type: 'application/octet-stream',
        });
        formData.append('key', key);

        try {
            const response = await fetch('http://INSERT_YOUR_OWN_IP/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            });
      
            const json = await response.json();
      
            if (response.ok) {
              const jianpuText = json.jianpu.map(measure => measure.join(' ')).join('\n');
              setResult(jianpuText);
            } else {
              setResult(`Error: ${json.error}`);
            }
          } catch (err) {
            setResult(`Network error: ${err.message}`);
          }
        };

    
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Score Reader</Text>
            <Button title="Pick Music File" onPress={pickFile} />
            <Text style={styles.text}>Selected File: {file ? file.name : 'None'}</Text>
    
            <TextInput
            placeholder="Enter base key (e.g., C4)"
            value={key}
            onChangeText={setKey}
            style={styles.input}
            />
    
            <Button title="Convert to Jianpu" onPress={uploadFile} />
    
            <Text style={styles.outputLabel}>Jianpu Output:</Text>
            <ScrollView style={styles.scroll}>
            <Text>{result}</Text>
            </ScrollView>

            <Button title = "Home" onPress ={() => navigation.navigate('Home')} />
        </View>
          );

        }


export default ScoreReader;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    flex: 1,
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
  },
});

