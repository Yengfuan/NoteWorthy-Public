import React, { useEffect } from 'react';
import { SplashScreen } from './SplashScreen'; // your existing Skia splash component
import { useNavigation } from '@react-navigation/native';

const Loading = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Inside'); // go to the tab navigator
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
};

export default Loading;
