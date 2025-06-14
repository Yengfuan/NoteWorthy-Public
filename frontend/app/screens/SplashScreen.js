
import React, { use, useState } from 'react';
import { Canvas, Image, useAnimatedImageValue } from '@shopify/react-native-skia';
import { View, Text, StyleSheet } from 'react-native';

export function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  setTimeout(() => {
    setIsLoading(false);
  }, 100);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <IconGif />
    </View>
  );
};

const IconGif = () => {

  const gif = useAnimatedImageValue(require('../../assets/IconGif.gif'));

  return (
    <Canvas style={{ width: 200, height: 200 }}>
      <Image
        image={gif}
        x={0}
        y={0}
        width={200}
        height={200}
        fit="contain"
      />
    </Canvas>
  );

}


const styles = StyleSheet.create({
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