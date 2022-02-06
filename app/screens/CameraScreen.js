import { Camera } from "expo-camera";
// import Camera from '../utils/CameraResize';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { cropPicture, getPrediction } from "../utils/predictionUtils";

const CLASSES = [
  "box",
  "glass bottle",
  "soda can",
  "crushed soda can",
  "plastic bottle",
];

function CameraScreen() {
  let camera;
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState("");

  // Take a picture
  const captureImage = async () => {
    if (!camera) return;
    const image = await camera.takePictureAsync({
      base64: true,
    });
    predict(image);
  };

  // Prediction of the image
  const predict = async (image) => {
    setIsProcessing(true);
    const croppedImage = await cropPicture(image, 300);

    const prediction = await getPrediction(croppedImage);

    console.log("prediction", prediction);

    const highestPred = prediction.indexOf(Math.max.apply(null, prediction));
    setPrediction(CLASSES[highestPred]);
  };

  // Check if the app has a permission to use camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Please provide an access to a camera.</Text>;
  }

  return (
    <View style={styles.container}>
      <Modal visible={isProcessing} transparent={true} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>The object is {prediction}</Text>
            {prediction === "" && <ActivityIndicator size="large" />}
            <TouchableOpacity
              onPress={() => {
                setPrediction("");
                setIsProcessing(false);
              }}
              style={styles.tryAgainButton}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Camera
        ref={(r) => {
          camera = r;
        }}
        style={styles.cameraView}
        type={Camera.Constants.Type.back}
        autoFocus={true}
        whiteBalance={Camera.Constants.WhiteBalance.auto}
      ></Camera>

      <TouchableOpacity onPress={() => captureImage()} style={styles.button} />
    </View>
  );
}

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraView: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  button: {
    position: "absolute",
    color: "#00FF00",
    bottom: 40,
    width: 300,
    zIndex: 100,
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginBottom: 40,
  },

  modal: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  modalContent: {
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: "#F9F7E8",
  },

  tryAgainButton: {
    width: 150,
    height: 50,
    marginTop: 60,
    borderRadius: 24,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
});

export default CameraScreen;
