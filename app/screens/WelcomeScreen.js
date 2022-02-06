import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, Image, StyleSheet, View, Pressable } from "react-native";
import {
  Alegreya_400Regular,
  Alegreya_400Regular_Italic,
  Alegreya_500Medium,
  Alegreya_500Medium_Italic,
  Alegreya_700Bold,
  Alegreya_700Bold_Italic,
  Alegreya_800ExtraBold,
  Alegreya_800ExtraBold_Italic,
  Alegreya_900Black,
  Alegreya_900Black_Italic,
} from "@expo-google-fonts/alegreya";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

function WelcomeScreen() {
  const navigation = useNavigation();
  const [titleText, setTitleText] = useState("Recycle IT");
  const [btnText, setBtnText] = useState("Try Now");

  let [fontsLoaded] = useFonts({
    Alegreya_400Regular,
    Alegreya_400Regular_Italic,
    Alegreya_500Medium,
    Alegreya_500Medium_Italic,
    Alegreya_700Bold,
    Alegreya_700Bold_Italic,
    Alegreya_800ExtraBold,
    Alegreya_800ExtraBold_Italic,
    Alegreya_900Black,
    Alegreya_900Black_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/background.jpg")}
        style={styles.background}
      ></Image>
      <Text style={styles.titleText}>
        {titleText}
        {"\n"}
        {"\n"}
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("CameraScreen")}
      >
        <Text style={styles.btnTextStyle}>{btnText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F7E8",
    paddingTop: 250,
    paddingLeft: 60,
    paddingRight: 50,
    paddingBottom: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    width: 300,
    height: 300,
    marginRight: 10,
    resizeMode: "stretch",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Alegreya_400Regular",
    textTransform: "uppercase",
    color: "#2C7352",
  },
  btnTextStyle: {
    fontWeight: "bold",
    fontFamily: "Alegreya_400Regular",
    textTransform: "uppercase",
    color: "white",
    fontSize: 20,
  },
  button: {
    textAlign: "center",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#2C7352",
  },
});

export default WelcomeScreen;
