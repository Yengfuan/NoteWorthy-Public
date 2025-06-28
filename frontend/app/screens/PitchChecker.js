import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from 'expo-av';
import Pitchy from 'react-native-pitchy';
import * as Device from 'expo-device';

const PitchChecker = () => {
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [pitchyReady, setPitchyReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // In your useEffect or component:
    console.log("expo-device module:", Device);
    console.log("Device model:", Device.modelName);
    console.log("Device OS version:", Device.osVersion);

    const initPitchy = async () => {
      try {
        // 1. Request microphone permissions
        const { granted } = await Audio.requestPermissionsAsync();
        console.log("Mic permission status:", granted);
        setHasPermission(granted);
        
        if (!granted) {
          console.warn("Microphone permission not granted");
          return;
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });

        // 2. Check if microphone is available
        try {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.stopAndUnloadAsync();
        microphoneAvailable = true;
        console.log("Microphone available (via recording test)");
        } catch (e) {
        console.warn("Microphone check via recording test failed:", e);
        }





        // 4. Initialize Pitchy
        const config = {
          algorithm: 'ACF2+',   
          bufferSize: 4096,
          minVolume: -60,
          sampleRate: 44100,
          channelCount: 1
        };

        console.log("config:", JSON.stringify(config));
        
        // If Pitchy needs explicit initialization, uncomment this:
        await Pitchy.init();
        console.log("Pitchy initialized");
        setPitchyReady(true);
      } catch (e) {
        console.error("Initialization error:", e);
      }
    };

    initPitchy();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      // Clean up Pitchy if needed
      if (pitchyReady) {
        Pitchy.stop().catch(e => console.warn("Error stopping Pitchy on cleanup:", e));
      }
    };
  }, []);

  const startDetection = async () => {
    if (!pitchyReady) return;
    
    try {
      const sub = Pitchy.addListener((data) => {
        if (data?.pitch) {
          setPitch(data.pitch.toFixed(2));
        }
      });
      setSubscription(sub);

      await Pitchy.start();
      console.log('Pitch detection started!');
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start pitch detection:', err);
    }
  };

  const stopDetection = async () => {
    try {
      await Pitchy.stop();
      console.log('Pitch detection stopped!');
      setIsListening(false);
      setPitch(null);
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    } catch (err) {
      console.error('Failed to stop pitch detection:', err);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  return (
    <View style={styles.container}>
      {!hasPermission && (
        <Text style={styles.warningText}>Microphone permission required</Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: !pitchyReady ? '#aaa' : isListening ? '#FF4136' : '#007BFF'
          },
        ]}
        onPress={toggleListening}
        disabled={!pitchyReady}
      >
        <Ionicons name="mic" size={50} color="white" />
      </TouchableOpacity>

      {pitch ? (
        <Text style={styles.pitchText}>Pitch: {pitch} Hz</Text>
      ) : (
        <Text style={styles.pitchText}>
          {pitchyReady ? "No pitch detected" : "Initializing..."}
        </Text>
      )}
    </View>
  );
};

export default PitchChecker;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
  },
  button: {
    padding: 20, 
    borderRadius: 50, 
    marginTop: 20,
  },
  pitchText: {
    fontSize: 24, 
    marginTop: 30, 
    fontWeight: 'bold',
  },
  warningText: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
  },
});