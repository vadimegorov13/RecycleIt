import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';

import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function App() {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);

  const handleImageCapture = async () => {
    const imageData = await cameraRef.current.takePictureAsync({
      base64: true,
    });

    console.log('image taken');
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.cameraView}
        type={Camera.Constants.Type.back}
        autoFocus={true}
        whiteBalance={Camera.Constants.WhiteBalance.auto}
      ></Camera>

      <Pressable
        onPress={() => handleImageCapture()}
        style={styles.button}
      ></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraView: {
    height: '100%',
    // left: Dimensions.get('screen').width / 2 - 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  button: {
    position: 'absolute',
    color: '#00FF00',
    bottom: 40,
    width: 300,
    zIndex: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 40,
  },
});
