import { router, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DistributionPage = () => {
  const [username, setusername] = useState<String>("");
  const [scores, setScores] = useState(
    Array(6).fill({ name: "", score: 0, color: "" })
  );

  useFocusEffect(
  useCallback(() => {
    const fetchScores = async () => {
      const newScores = [
        {
          name: "Vital Statistics",
          score: await AsyncStorage.getItem("General_Health_Score"),
          color: "#FFE700",
        },
        {
          name: "ENT",
          score: await AsyncStorage.getItem("ENT_Score"),
          color: "#9370DB",
        },
        {
          name: "Vision",
          score: await AsyncStorage.getItem("Vision_score"),
          color: "#87CEFA",
        },
        {
          name: "Oral Health",
          score: await AsyncStorage.getItem("Oral_score"),
          color: "#DDA0DD",
        },
        {
          name: "Physical Wellness",
          score: await AsyncStorage.getItem("Physical_Health_Score"),
          color: "#00BFFF",
        },
        {
          name: "Mental Health",
          score: await AsyncStorage.getItem("Mental_Wellness_Score"),
          color: "#BACACA",
        },
      ];

      setScores(
        newScores.map((item) => ({
          ...item,
          score: item.score ? parseFloat(item.score) || 0 : 0, // Convert score to a number or default to 0
        }))
      );
    };

    fetchScores();
  }, [])
);

  const fixuser=async()=>{
     setusername((await AsyncStorage.getItem('username')) ?? '');
  }
  useFocusEffect(
      useCallback(() => {
         fixuser()
      }, [])
    );
  const getProgressColor = (score: number) => {
    if (score >= 0 && score <= 50) return "#FF0000";
    if (score >= 51 && score <= 79) return "#FFA500";
    if (score >= 80 && score <= 100) return "#00FF00";
    return "#CCC"; // Default color for out-of-range values
  };

  const handleProfileLogo = () => {
    router.push("tabs/profile");
  };

  const handleOverallScore = () => {
    console.log("Calculate Overall Health Score");
    router.push("tabs/score");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleProfileLogo}>
          <Image
            source={require("../../assets/icons/triangle.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{username}</Text>
      </View>

      <Text style={styles.individualBtn}>Your Individual Score</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {scores.map((item, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
          >
            <View style={styles.progressCircleContainer}>
              <AnimatedCircularProgress
                size={screenWidth * 0.19}
                width={7}
                fill={item.score} // Resolved and converted score
                tintColor={getProgressColor(item.score)} // Dynamic color based on score
                backgroundColor="#FFFFFF"
              />
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
            <Text style={styles.label}>{item.name}</Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={handleOverallScore}
          style={styles.overallButton}
        >
          <Text style={styles.buttonText}>See Overall Score</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical:screenHeight* 0.02,
    paddingHorizontal: screenWidth * 0.05,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight*0.01,
  },
 profileImage: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: (screenWidth * 0.12) / 2,
    marginRight: screenWidth * 0.04,
  },
  username: {
    fontSize: screenWidth * 0.07,
    fontWeight: "bold",
  },
  
  individualBtn: {
    color: "black",
    fontSize: screenWidth * 0.06,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: screenHeight*0.01,
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: screenWidth * 0.42,
    height: screenHeight * 0.16, // Reduced by 20% from 40% to 32%
    marginVertical: screenHeight*0.008,
    paddingVertical:screenHeight* 0.01,
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal:screenWidth*0.01, // Horizontal margin to keep the layout centered
    fontSize:screenHeight*0.1
  },
  progressCircleContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    
  },
  scoreText: {
    position: "absolute", // Position the score inside the circle
    fontSize: screenWidth*0.05,
    fontWeight: "bold",
    color: "#000000",
    justifyContent:"center"

  },
  label: {
    fontSize: screenWidth*0.04, // Increased font size of category text to 18
    textAlign: "center",
    color: "#000000",
    marginTop:screenHeight*0.01
  },
  overallButton: {
    width: screenWidth * 0.7,
    backgroundColor: "green",
    padding: screenWidth * 0.03,
    borderRadius: screenWidth * 0.02,
    marginBottom: screenHeight * 0.02,
    marginLeft:screenWidth*0.08,
    marginRight:screenWidth*0.08,
    marginTop:screenHeight*0.01
  },
  buttonText: {
    color: "white",
    fontSize: screenWidth * 0.05, // Adjusted font size for better readability
    fontWeight: "bold",
    textAlign:"center"
  },
});

export default DistributionPage;