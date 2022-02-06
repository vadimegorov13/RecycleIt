import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Base64Binary } from './base64binary';
import { Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const model = require('../../model/model.json');
const weights = require('../../model/weights.bin');

// Bitmap Dimension of the model
export const BITMAP_DIMENSION = 32;

export const getModel = async () => {
  // Connect tesorflow
  await tf.ready();
  // Load the model
  return await tf.loadLayersModel(bundleResourceIO(model, weights));
};

export const convertBase64 = async (base64Image) => {
  // Get uInt array
  const uInt = Base64Binary.decode(base64Image);
  // Decode image to a dtype
  const decodedImage = decodeJpeg(uInt, 3);
  // Get 4D array
  return decodedImage.reshape([1, BITMAP_DIMENSION, BITMAP_DIMENSION, 3]);
};

export const getPrediction = async (croppedImage) => {
  // Get model
  const model = await getModel();

  const reshapedImage = await convertBase64(croppedImage.base64);

  // Predict
  const output = model.predict(reshapedImage);
  return output.dataSync();
};

// Function for cropping image to the dimenstions of the model
export const cropPicture = async (image, dimension) => {
  // Get dimensions of the screen
  const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } =
    Dimensions.get('window');
  // get image data
  const { uri, width, height } = image;

  // Crop image
  const cropWidth = dimension * (width / DEVICE_WIDTH);
  const cropHeight = dimension * (height / DEVICE_HEIGHT);

  // Apply actions for the ImageManipulator
  // - crop
  // - resize
  const actions = [
    {
      crop: {
        originX: width / 2 - cropWidth / 2,
        originY: height / 2 - cropHeight / 2,
        width: cropWidth,
        height: cropHeight,
      },
    },
    {
      resize: {
        width: BITMAP_DIMENSION,
        height: BITMAP_DIMENSION,
      },
    },
  ];

  const options = {
    compress: 1,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  };

  // Get new image
  const croppedImage = await ImageManipulator.manipulateAsync(
    uri,
    actions,
    options
  );

  return croppedImage;
};
