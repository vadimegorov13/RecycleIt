import { Camera as OriginalCamera } from 'expo-camera';
import React, { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';

// Repository for this file - https://github.com/expo/expo/blob/1e001f80d902303a40e370c7b996b01c3b088119/home/components/Camera.android.tsx
// This Camera component will automatically pick the appropriate ratio and
// dimensions to fill the given layout properties, and it will resize according
// to the same logic as resizeMode: cover. If somehow something goes wrong while
// attempting to autosize, it will just fill the given layout and use the
// default aspect ratio, likely resulting in skew.

export function Camera(props) {
  const [dimensions, onLayout] = useComponentDimensions();
  const [suggestedAspectRatio, suggestedDimensions, ref] =
    useAutoSize(dimensions);
  const [cameraIsReady, setCameraIsReady] = useState(false);
  const { style, ...rest } = props;
  const { width, height } = suggestedDimensions || {};

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          overflow: 'hidden',
          backgroundColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <OriginalCamera
        onCameraReady={() => setCameraIsReady(true)}
        ref={cameraIsReady ? ref : undefined}
        ratio={suggestedAspectRatio ?? undefined}
        style={
          suggestedDimensions && width && height
            ? {
                position: 'absolute',
                width,
                height,
                ...(height > width
                  ? { top: -(height - dimensions.height) / 2 }
                  : { left: -(width - dimensions.width) / 2 }),
              }
            : { flex: 1 }
        }
        {...rest}
      />
    </View>
  );
}

function useAutoSize(dimensions) {
  const [supportedAspectRatios, ref] = useSupportedAspectRatios();
  const [suggestedAspectRatio, setSuggestedAspectRatio] = useState(null);
  const [suggestedDimensions, setSuggestedDimensions] = useState(null);

  useEffect(() => {
    const suggestedAspectRatio = findClosestAspectRatio(
      supportedAspectRatios,
      dimensions
    );
    const suggestedDimensions = calculateSuggestedDimensions(
      dimensions,
      suggestedAspectRatio
    );

    if (!suggestedAspectRatio || !suggestedDimensions) {
      setSuggestedAspectRatio(null);
      setSuggestedDimensions(null);
    } else {
      setSuggestedAspectRatio(suggestedAspectRatio);
      setSuggestedDimensions(suggestedDimensions);
    }
  }, [dimensions, supportedAspectRatios]);

  return [suggestedAspectRatio, suggestedDimensions, ref];
}

// Get the supported aspect ratios from the camera ref when the node is available
// NOTE: this will fail if the camera isn't ready yet. So we need to avoid setting the
// ref until the camera ready callback has fired
function useSupportedAspectRatios() {
  const [aspectRatios, setAspectRatios] = useState(null);

  const ref = useCallback(
    (node) => {
      async function getSupportedAspectRatiosAsync(node) {
        try {
          const result = await node.getSupportedRatiosAsync();
          setAspectRatios(result);
        } catch (e) {
          console.error(e);
        }
      }

      if (node !== null) {
        getSupportedAspectRatiosAsync(node);
      }
    },
    [setAspectRatios]
  );

  return [aspectRatios, ref];
}

const useComponentDimensions = () => {
  const [dimensions, setDimensions] = useState(null);

  const onLayout = useCallback(
    (event) => {
      const { width, height } = event.nativeEvent.layout;
      setDimensions({ width, height });
    },
    [setDimensions]
  );

  return [dimensions, onLayout];
};

function ratioStringToNumber(ratioString) {
  const [a, b] = ratioString.split(':');
  return parseInt(a, 10) / parseInt(b, 10);
}

function findClosestAspectRatio(supportedAspectRatios, dimensions) {
  if (!supportedAspectRatios || !dimensions) {
    return null;
  }

  try {
    const dimensionsRatio =
      Math.max(dimensions.height, dimensions.width) /
      Math.min(dimensions.height, dimensions.width);

    const aspectRatios = [...supportedAspectRatios];
    aspectRatios.sort((a, b) => {
      const ratioA = ratioStringToNumber(a);
      const ratioB = ratioStringToNumber(b);
      return (
        Math.abs(dimensionsRatio - ratioA) - Math.abs(dimensionsRatio - ratioB)
      );
    });

    return aspectRatios[0];
  } catch (e) {
    // If something unexpected happens just bail out
    console.error(e);
    return null;
  }
}

function calculateSuggestedDimensions(containerDimensions, ratio) {
  if (!ratio || !containerDimensions) {
    return null;
  }

  try {
    const ratioNumber = ratioStringToNumber(ratio);
    const width = containerDimensions.width;
    const height = width * ratioNumber;
    return { width, height };
  } catch (e) {
    // If something unexpected happens just bail out
    console.error(e);
    return null;
  }
}
