import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet} from 'react-native';
import { Audio } from 'expo-audio';
import { detectPitch } from 'pitchy';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Tuner() {
  const recordingRef = useRef(null);
  const [pitchInfo, setPitchInfo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    return () => {
      if (recordingRef.current?.interval) {
        clearInterval(recordingRef.current.interval);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HighQuality
      );
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);

      const interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          const { sound, uri } = await recording.createNewLoadedSoundAsync();
          const buffer = await fetch(uri).then(res => res.arrayBuffer());
          const audioBuffer = new Float32Array(buffer);

          const [pitch, clarity] = detectPitch(audioBuffer, 44100);

          if (clarity > 0.75 && pitch) {
            setPitchInfo({ pitch: pitch.toFixed(2), clarity });
          }

          await sound.unloadAsync(); // cleanup
        }
      }, 300);

      recordingRef.current.interval = interval;
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      clearInterval(recordingRef.current.interval);
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
      setIsRecording(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <PitchCheckerButton onPress = {isRecording ? stopRecording : startRecording} toggled={isRecording} /> 
      {pitchInfo && (
        <View style={{ marginTop: 20 }}>
          <Text>Pitch: {pitchInfo.pitch} Hz</Text>
          <Text>Clarity: {(pitchInfo.clarity * 100).toFixed(0)}%</Text>
        </View>
      )}
    </View>
  );
}

const PitchCheckerButton = ({ onPress, toggled }) => {
  return (
      <TouchableOpacity
          style={[
              styles.button,
              { backgroundColor: toggled ? '#FF4136' : '#007BFF' } 
          ]}
          onPress={onPress}
      >
          <Ionicons name="mic" size={50} color="white" />
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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