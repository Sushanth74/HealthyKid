import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Profile = () => {
  const [showReport, setShowReport] = useState(false);
  const [userId, setuserId] = useState("");  // State to toggle report content
  const [score, setScore] = useState(0);
  const [username, setusername] = useState<String>("");
  const [age, setAge] = useState<String>("");
  const [gender, setGender] = useState<String>("");

  const fetchScore = async (userId: string) => {
    if (!userId) return;
    try {
      const response = await fetch(`http://192.168.0.102:5002/routes/auth/getScores?UserID=${userId}`);
      const data = await response.json();
      data.scores = [...data.scores].sort((a, b) => b.ScoresID - a.ScoresID);
      if (Array.isArray(data.scores)) {
        setScore(Math.round(data.scores[0]?.Overall_score?.toFixed() || 0));
      }
    } catch (error) {
      console.error('Error fetching score:', error);
    }
  };

  const fixUser = async () => {
    const username = await AsyncStorage.getItem('username');
    const userId = await AsyncStorage.getItem('UserID');
    const age = await AsyncStorage.getItem('age');
    const gender = await AsyncStorage.getItem('gender');

    setusername(username ?? '');
    setuserId(userId ?? '');
    setAge(age ?? '');
    setGender(gender ?? '');

    // Now fetch the score after userId is properly set
    if (userId) {
      fetchScore(userId);  // Pass userId explicitly to the fetch function
    }
  };

  useFocusEffect(
    useCallback(() => {
      fixUser();
    }, [])
  );
  const router=useRouter();
  const handleLogout = () => {
    // Add your logout logic here
    router.push('auth/sign-in');
  };

  // const handleReport = () => {
  //   setShowReport(!showReport); // Toggle the report visibility
  // };
  
  

  const categories = ['Vital Statistics', 'ENT', 'Vision', 'Oral Health', 'Physical Health', 'Mental Wellness'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Logo */}
      <Image source={require('../../assets/icons/triangle.png')} style={styles.profileImage} />

      {/* User Details */}
      <View style={styles.userDetails}>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.info}>Age: {age} | Gender: {gender}</Text>
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.recordScore}>Your Overall Score: {score}</Text>
        {/* <TouchableOpacity onPress={handleReport}>
          <Image source={require('../../assets/icons/report.png')} style={styles.reportIcon} />
        </TouchableOpacity> */}
      </View>

      {/* Report Content (conditionally rendered) */}
      {showReport && (
        <View style={styles.reportContainer}>
          <Text style={styles.reportHeader}>Health Categories</Text>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.overallscoreContainer}>
                            <Text style={styles.overallscoreText}>Report</Text>
                        </TouchableOpacity>
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
        <Image source={require('../../assets/icons/logout.png')} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom:screenWidth*0.3,
    backgroundColor: '#f9f9f9',
  },
  profileImage: {
    width: screenWidth*0.217,
    height: screenHeight*0.115,
    marginBottom: screenHeight*0.01,
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: screenHeight*0.02,
  },
  name: {
    fontSize: screenWidth*0.08,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: screenWidth*0.045,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight*0.01,
  },
  recordScore: {
    fontSize: screenWidth*0.07,
    fontWeight: '600',
    color: '#555',
    marginRight: 10,
  },
  reportIcon: {
    width: screenWidth*0.07,
    height: screenHeight*0.04,
  },
  reportContainer: {
    marginTop: screenHeight*0.02,
    width: '100%',
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 5,
  },
  reportHeader: {
    fontSize: screenWidth*0.06,
    fontWeight: 'bold',
    color: '#007acc',
    marginBottom: screenHeight*0.01,
  },
  categoryItem: {
    padding: 12,
    marginBottom: screenHeight*0.01,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  categoryText: {
    fontSize: screenWidth*0.04,
    color: '#333',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign:'center',
    justifyContent:'center',
    marginTop: screenHeight*0.02,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    width:screenWidth*0.4,
  },
  logoutIcon: {
    width: screenWidth*0.07,
    height: screenHeight*0.035,
    marginRight: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: screenWidth*0.05,
  },
  overallscoreText:{
    fontSize: screenWidth * 0.06, // Responsive font size
    color: 'white',
    textAlign:"center",
    
  },
  overallscoreContainer:{
    marginTop: screenHeight * 0.01, // Dynamic margin
    backgroundColor: 'black',
   
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    margin:screenWidth*0.28,
    height:screenHeight*0.055,
    marginBottom:screenHeight*0.01
  }
});
