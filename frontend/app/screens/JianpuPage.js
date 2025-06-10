import React from 'react';
import { View, ScrollView, StyleSheet, Image, Text, Button } from 'react-native';

const JianpuPage = ({ navigation, output}) => {
  
  console.log('Jianpu Output:', `${output}`);
  

  return (
    <View>
      <Text>{123}</Text>
    </View>
    // <View style={styles.container}>
    //   <Text style={styles.title}>Jianpu Output</Text>
    //   <ScrollView contentContainerStyle={styles.scrollContainer}>
    //     {svgUris.map((uri, index) => (
    //       <Image
    //         key={index}
    //         source={{ uri }}
    //         style={styles.svgImage}
    //         resizeMode="contain"
    //       />
    //     ))}
    //   </ScrollView>
    //   <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    // </View>
  );
};

export default JianpuPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  svgImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
});
