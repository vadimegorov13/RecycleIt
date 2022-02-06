import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, Image, StyleSheet, View, Pressable } from "react-native";
import {
  Montserrat_100Thin,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

function WelcomeScreen() {
  const navigation = useNavigation();
  const [titleText, setTitleText] = useState("RecycleIT");
  const [btnText, setBtnText] = useState("Explore");

  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
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
    fontFamily: "Montserrat_500Medium",
    color: "#2C7352",
  },
  btnTextStyle: {
    fontWeight: "bold",
    fontFamily: "Montserrat_400Regular",
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
