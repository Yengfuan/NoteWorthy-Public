import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import JianpuChord from './JianpuChord';

const JianpuPage = ({ route }) => {
  const { output } = route.params;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Jianpu Output</Text>

       {output.map((measure, mIndex) => (
        <View key={`measure-${mIndex}`} style={styles.measure}>
          {measure.map((chord, cIndex) => (
            <View key={`chord-${cIndex}`} style={styles.chord}>
              <JianpuChord notes={chord.notes} underline={chord.underline} />
            </View>
          ))}
        </View>
      ))} 
    </ScrollView>
  );
};

export default JianpuPage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  measure: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  chord: {
    marginRight: 10,
  },
});