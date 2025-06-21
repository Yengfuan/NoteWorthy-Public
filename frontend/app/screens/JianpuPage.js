import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import JianpuChord from './JianpuChord';
import Ionicons from "@expo/vector-icons/Ionicons";

const screenWidth = Dimensions.get('window').width;

const JianpuPage = ({ route, navigation }) => {
  const { output } = route.params;

  const measuresWithBarLine = output.map((measure, index) => [...measure, "barLine"]).flat();
  console.log("measuresWithBarLine", measuresWithBarLine);

  return (
    <View>
      <HomeButton onPress={ () => navigation.navigate('Inside', {
      screen: 'Home'
  })} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Jianpu Notation</Text>
        <View style={styles.a4Container}>
          {measuresWithBarLine.map((chord, index) => (
            <React.Fragment key={index}>
              {chord === "barLine" ? (
                <>
                  <View style={styles.barLine} />
                </>
              ) : (
                <>
                  {<JianpuChord notes={chord.notes} underline={chord.underline} />}
                </>
              )}
            </React.Fragment>
          ))}

        </View>
      </ScrollView>
    </View>

  );
};

export default JianpuPage;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    alignItems: 'center', 
  },
  a4Container: {
    width: screenWidth * 0.95,  // simulate A4 width at 96dpi — adjust if too wide for mobile
    backgroundColor: '#fff',  // white background like paper
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  measure: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chord: {
    marginRight: 10,
  },
  barLine: {
    width: 2,
    height: 150, 
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
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