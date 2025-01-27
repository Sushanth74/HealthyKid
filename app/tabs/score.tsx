import React, { useEffect, useState ,useCallback} from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For accessing local storage
import { PieChart } from "react-native-chart-kit";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
type ChartData = {
  name: string;
  color: string;
  population: number;
};  

const ScorePage = () => {
  const [data, setData] = useState<ChartData[]>([]); // Explicitly define the type of data
  const [overallScore, setOverallScore] = useState<number>(0);
  const [username, setusername] = useState<String>("");
  

  
  const fetchDataFromStorage = async () => {
    try {
      setusername((await AsyncStorage.getItem('username')) ?? '');
      // Example keys for population values stored in AsyncStorage
      const keys = [
        "General_Health_Score",
        "ENT_Score",
        "Vision_score",
        "Oral_score",
        "Physical_Health_Score",
        "Mental_Wellness_Score",
      ];

      // Fetch population values
    const fetchedData = await Promise.all(
    keys.map(async (key) => {
        const value = await AsyncStorage.getItem(key);
        return parseInt(value ?? "0", 10); // Use "0" as a fallback if value is null
    })
);


      // Prepare chart data
      const chartData = [
        { name: "- Vital Score", color: "#DC143C", population: fetchedData[0]},
        { name: "- ENT Score", color: "#FFD700", population: fetchedData[1] },
        { name: "- Vision Score", color: "#40E0D0", population: fetchedData[2] },
        { name: "- Oral Health", color: "#32CD32", population: fetchedData[3] },
        { name: "- Physical Health", color: "#BA55D3", population: fetchedData[4] },
        { name: "- Mental Wellness", color: "#FF7F50", population: fetchedData[5] },
      ];

      console.log('fetchedData:',fetchedData)
      // Calculate overall score (average)
      const total = fetchedData.reduce((sum, value) => sum + value, 0);
      const average = total / fetchedData.length;

      setData(chartData);
      setOverallScore(average);
    } catch (error) {
      console.error("Error fetching data from local storage:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchDataFromStorage();
    }, [])
  );

  const radius = screenWidth * 0.12; // Adjusted radius
  const strokeWidth = screenWidth * 0.02;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const getLabelPosition = (index: number) => {
    const totalPopulation = data.reduce((sum, entry) => sum + entry.population, 0);
    let accumulatedAngle = 0;

    data.forEach((entry, idx) => {
      const sliceAngle = (entry.population / totalPopulation) * 360;
      if (idx === index) {
        accumulatedAngle += sliceAngle / 2;
      } else {
        accumulatedAngle += sliceAngle;
      }
    });

    const labelAngle = accumulatedAngle - 90;
    const x = Math.cos((labelAngle * Math.PI) / 180) * radius + screenWidth / 2;
    const y = Math.sin((labelAngle * Math.PI) / 180) * radius + screenHeight / 3;

    return { x, y };
  };

  const handleIndividualScore = () => {
    router.push("tabs/dist");
  };

  const handleProfileLogo = () => {
    router.push("tabs/profile");
  };

  const getFillColor = (score: number) => {
    if (score <= 50) return "#FF0000"; // Red
    if (score <= 79) return "#FFA500"; // Orange
    return "#00FF00"; // Green
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleProfileLogo}>
          <Image
            source={require("../../assets/icons/triangle.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{username}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Your Overall Health Score</Text>

      {/* Pie Chart */}
      <View style={styles.pieChartContainer}>
        {data.length > 0 ? (
          <PieChart
            data={data}
            width={screenWidth * 0.88}
            height={screenHeight * 0.23}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#f8f8f8",
              backgroundGradientTo: "#f8f8f8",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="-4"
            absolute
            
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      {/* Overall Score with Circular Hollow Progress Bar */}
      <View style={styles.blackBackground}>
        <View style={styles.circularProgressContainer}>
          <Svg width={radius * 2} height={radius * 2}>
            <Circle
              stroke="#E6E6E6"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <Circle
              stroke={getFillColor(overallScore)}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </Svg>
          <Text style={styles.scoreText}>{Math.round(overallScore)}</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity onPress={handleIndividualScore} style={styles.individualButton}>
        <Text style={styles.individualButtonText}>See Individual Category Scores</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.02,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
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
  title: {
    fontSize: screenWidth * 0.06,
    fontWeight: "bold",
    marginBottom: screenHeight * 0.03,
    textAlign: "center",
  },
  pieChartContainer: {
    backgroundColor: "#DFFFD6",
    position: "relative",
    paddingVertical: screenWidth*0.01,
    borderRadius: screenWidth * 0.03,
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
    justifyContent:"center"
  },
  pieChartLabel: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  blackBackground: {
    backgroundColor: "#000000",
    padding: screenWidth * 0.03,
    borderRadius: screenWidth * 0.03,
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
    marginLeft: screenWidth * 0.25,
    marginRight: screenWidth * 0.25,
  },
  circularProgressContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    position: "absolute",
    fontSize: screenWidth * 0.08,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  individualButton: {
    backgroundColor: "green",
    padding: screenWidth * 0.03,
    borderRadius: screenWidth * 0.02,
    marginBottom: screenHeight * 0.02,
    alignItems: "center",
    justifyContent: "center",
    marginLeft:screenWidth*0.08,
    marginRight:screenWidth*0.08
  },
  individualButtonText: {
    color: "#FFFFFF",
    fontSize: screenWidth * 0.05,
    fontWeight: "bold",
  },
});

export default ScorePage;
