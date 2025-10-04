import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  Easing,
  ImageBackground,
  StatusBar,
} from "react-native";
import LottieView from "lottie-react-native";
import { Image } from "react-native";


const { width, height } = Dimensions.get("window");

export default function Splash({ navigation }) {
  const text = "SmartVitals";
  const animatedValues = useRef(
    text.split("").map(() => new Animated.Value(0))
  ).current;

  // Animation refs for morphing letters and welcome content
  const nameTranslateY = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const floatHeart = useRef(new Animated.Value(0)).current;
  const floatShoe = useRef(new Animated.Value(0)).current;
  const floatSpo2 = useRef(new Animated.Value(0)).current;
  const floatWeight = useRef(new Animated.Value(0)).current;

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
      // Heart animation
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatHeart, { toValue: -12, duration: 1800, useNativeDriver: true }),
      Animated.timing(floatHeart, { toValue: 0, duration: 1800, useNativeDriver: true }),
    ])
  ).start();

  // Shoe animation (faster, smaller float)
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatShoe, { toValue: -8, duration: 1400, useNativeDriver: true }),
      Animated.timing(floatShoe, { toValue: 0, duration: 1400, useNativeDriver: true }),
    ])
  ).start();

  // SpO2 animation (slower, bigger float)
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatSpo2, { toValue: -15, duration: 2200, useNativeDriver: true }),
      Animated.timing(floatSpo2, { toValue: 0, duration: 2200, useNativeDriver: true }),
    ])
  ).start();

  // Weight animation (different speed)
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatWeight, { toValue: -10, duration: 1600, useNativeDriver: true }),
      Animated.timing(floatWeight, { toValue: 0, duration: 1600, useNativeDriver: true }),
    ])
  ).start();
    // Letter-by-letter animation
    const letterAnimations = animatedValues.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 150,
        delay: i * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(80, letterAnimations).start(() => {
      // Pause a bit before morphing
      setTimeout(() => {
        setShowWelcome(true);

        // Morph letters: move up + scale
        Animated.parallel([
          Animated.timing(nameTranslateY, {
            toValue: -50,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(nameScale, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Fade in Welcome text, description, and button sequentially
          Animated.stagger(200, [
            Animated.timing(welcomeOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(messageOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(buttonOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, 500); // pause for 500ms
    });
  }, []);

  // Splash with letter-by-letter + Lottie
  if (!showWelcome) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/screen.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />

        <View style={styles.textContainer}>
          {text.split("").map((letter, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.appNameSplash,
                {
                  opacity: animatedValues[i],
                  transform: [
                    {
                      translateY: animatedValues[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>
      </View>
    );
  }

  // Welcome screen with morph animation
  return (
    <ImageBackground
      source={require("../../assets/login.jpg")} // replace with your image
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.overlay} />

      <View style={styles.welcomeContainer}>
        {/* Welcome To above the name */}
        <Animated.Text
          style={[
            styles.welcomeTitle,
            { opacity: welcomeOpacity, marginBottom: 40 },
          ]}
        >
          Welcome to
        </Animated.Text>

        {/* Letters morph together */}
        <Animated.View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            transform: [
              { translateY: nameTranslateY },
              { scale: nameScale },
            ],
          }}
        >
          {text.split("").map((letter, i) => (
            <Animated.Text
              key={i}
              style={[styles.appNameSplash, { opacity: animatedValues[i] }]}
            >
              {letter}
            </Animated.Text>
          ))}
        </Animated.View>

        {/* Description */}
        <Animated.Text
          style={[styles.welcomeText, { opacity: messageOpacity }]}
        >
          Monitor your vitals,{"\n"}
          achieve your goals,{"\n"}
          live healthier every day.  

        </Animated.Text>

        {/* Get Started Button */}
        <Animated.View style={{ opacity: buttonOpacity, marginTop: 30 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
     {/* Heart Icon - Top Right */}
<Animated.Image
  source={require("../../assets/heart.png")}
  style={[
    styles.icon,
    { top: 80, right: 40, transform: [{ translateY: floatHeart }] }
  ]}
/>
{/* Shoe Icon - Bottom Left */}
<Animated.Image
  source={require("../../assets/shoes.png")}
  style={[
    styles.icon,
    { bottom: 100, left: 50, transform: [{ translateY: floatShoe }] }
  ]}
/>

{/* SpO2 Icon - Top Left */}
<Animated.Image
  source={require("../../assets/spo2.png")}
  style={[
    styles.icon,
    { top: 150, left: 30, transform: [{ translateY: floatSpo2 }] }
  ]}
/>

{/* Weight Icon - Bottom Right */}
<Animated.Image
  source={require("../../assets/bmi.png")}
  style={[
    styles.icon,
    { bottom: 140, right: 45, transform: [{ translateY: floatWeight }] }
  ]}
/>


      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  animation: { width: width, height: height, position: "absolute" },
  textContainer: {
    position: "absolute",
    top: "45%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  appNameSplash: {
    fontSize: 36,
    color: "#fff",
    letterSpacing: 2,
    fontFamily: "WorkSansExtraBoldItalic",
  },

  background: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    color: "#bbb",
    // textAlign: "center",
  },
  welcomeText: {
    fontSize: 25,
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
    marginBottom:20,
    lineHeight: 26,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  iconsRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 60,
  marginBottom: 20,
},
icon: {
  position: "absolute",
  width: 55,
  height: 55,
  opacity: 0.9,
  tintColor: "#fff" // optional if you want them all white
},

});
