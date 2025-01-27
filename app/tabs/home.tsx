// import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width, height } = Dimensions.get('window');

// // Define a type for the score data
// interface Score {
//   Date: string;
//   Overall_score: number;
// }

// const Home = () => {
//   const router = useRouter();
//   const [scores, setScores] = useState<Score[]>([]);
//   const [currentHealthScore, setCurrentHealthScore] = useState(0);
//   const [loading, setLoading] = useState(true); // Loading state to manage async rendering

//   // Fetch scores from the database and set them in state
//   const fetchScores = async () => {
//   const userId = await AsyncStorage.getItem('UserID'); // Get the user ID from AsyncStorage
//   console.log("UserID from AsyncStorage:", userId);  // Debug log for UserID
//   if (userId) {
//     try {
//       const response = await fetch(`http://192.168.0.109:5002/routes/auth/getScores?UserID=${userId}`);
//       const data = await response.json();
//       console.log('Fetched data:', data); // Log the raw fetched data

//       // Check if the response contains scores
//       if (Array.isArray(data.scores)) {
//         console.log('Scores fetched:', data.scores);  // Debug log for fetched scores
//         setScores(data.scores); // Set the scores state
//         setCurrentHealthScore(data.scores[0]?.Overall_score || 0); // Set the latest score
//       } else {
//         console.log('Error: No scores found or invalid format');
//       }
//     } catch (error) {
//       console.error('Error fetching scores:', error);
//     } finally {
//       setLoading(false); // Set loading to false once data is fetched
//     }
//   } else {
//     console.log('User ID not found');
//     setLoading(false); // Stop loading if user ID is not found
//   }
// };

//   useEffect(() => {
//     fetchScores(); // Fetch scores when the component mounts
//   }, []);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString); // Create a Date object from the ISO string
//     return date.toLocaleDateString('en-US', { // Format the date
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   // Function to handle logout click
//   const handleLogout = () => {
//     router.push('auth/sign-in'); // Navigate to sign-in page
//   };

//   const handleNewScreening = () => {
//     router.push('tabs/calculate'); // Navigate to calculate page
//   };

//   const handleprofilelogo = () => {
//     router.push('tabs/profile'); // Navigate to profile page
//   };

//   const handleReport = () => {
//   };

//   const categories = ['Vital Statistics', 'ENT', 'Vision', 'Oral Health', 'Physical Health', 'Mental Wellness'];

//   // Conditional rendering based on loading state
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Top Row */}
//       <View style={styles.topRow}>
//         <View style={styles.userInfo}>
//           <TouchableOpacity onPress={handleprofilelogo}>
//             <Image
//               source={require('../../assets/icons/triangle.png')}
//               style={styles.userImage}
//             />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.welcomeText}>Welcome</Text>
//             <Text style={styles.username}>Sushanth</Text>
//           </View>
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity onPress={handleLogout}>
//           <Image
//             source={require('../../assets/icons/logout.png')}
//             style={styles.icon}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Health Score Container */}
//       <View style={styles.healthScoreContainer}>
//         <View style={styles.circularContainer}>
//           <Text style={styles.healthScore}>{currentHealthScore}</Text>
//         </View>
//         <Text style={styles.healthScoreText}>Your Current Health Score</Text>
//       </View>

//       {/* New Screening Section */}
//       <TouchableOpacity onPress={handleNewScreening} style={styles.newScreeningContainer}>
//         <Text style={styles.newScreeningText}>+ New Screening</Text>
//       </TouchableOpacity>

//       {/* Recent Records Section */}
//       <Text style={styles.recentRecordsTitle}>Recent Records</Text>
//       <View style={styles.recordsContainer}>
//         {scores.map((record, index) => (
//           <View key={index} style={styles.recordItem}>
//             <Text style={styles.recordDate}>{formatDate(record.Date)}</Text>
//             <Text style={styles.recordScore}>Score: {record.Overall_score}</Text>
//             <TouchableOpacity onPress={handleReport}>
//               <Image source={require('../../assets/icons/report.png')} style={styles.reportIcon} />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default Home;

import React, { useState, useEffect,useCallback } from 'react';
import { useFocusEffect } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ReactNativeFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Sharing from 'expo-sharing';
import { jsPDF } from 'jspdf'; 
import { PDFDocument } from 'react-native-pdf-lib';


const { width, height } = Dimensions.get('window');

// Define a type for the score data
interface Score {
  ScoresID: string;
  Date: string;
  Overall_score: number;
  General_Health_Score: number;
  ENT_Score: number;
  Vision_score: number;
  Oral_score: number;
  Physical_score: number;
  Mental_Wellness_Score: number;
}

const Home =  () => {
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [username, setusername] = useState<String>("");
  const [currentHealthScore, setCurrentHealthScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchScores = async () => {
    const userId = await AsyncStorage.getItem('UserID');
    setusername((await AsyncStorage.getItem('username')) ?? '');

    console.log('UserID from AsyncStorage:', userId);
    if (userId) {
      try {
        const response = await fetch(`http://192.168.0.102:5002/routes/auth/getScores?UserID=${userId}`);
        let data = await response.json();
        data.scores = [...data.scores].sort((a, b) => b.ScoresID - a.ScoresID);
        if (Array.isArray(data.scores)) {
          setScores(data.scores);
          console.log(data.scores)
          setCurrentHealthScore(Math.round(data.scores[0]?.Overall_score?.toFixed() || 0));
          console.log("Current Health Score (Rounded):", Math.round(data.scores[0]?.Overall_score || 0));
        } else {
          console.log('Error: No scores found or invalid format');
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('User ID not found');
      setLoading(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
        fetchScores();
      }, [])  
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return '#32CD32'; // Green for high scores
    if (score >= 50) return '#FFA500'; // Orange for medium scores
    return '#FF0000'; // Red for low scores
  };



const saveAndShareFile = async (record: Score) => {
    // Generate report content once
    const reportContent = `
      Health Report
      ====================================================
      Date: ${formatDate(record.Date)}

      General Health Score: ${record.General_Health_Score}
      ENT Score: ${record.ENT_Score}
      Vision Score: ${record.Vision_score}
      Oral Health Score: ${record.Oral_score}
      Physical Health Score: ${record.Physical_score}
      Mental Wellness Score: ${record.Mental_Wellness_Score}

      ====================================================
      Overall Score: ${record.Overall_score?.toFixed()}
    `;

    if (Platform.OS === 'web') {
      try {
        // For Web: Generate PDF using jsPDF
        const doc = new jsPDF();
        doc.text(reportContent, 10, 10); // Position of text in the PDF
        const pdfOutput = doc.output('blob'); // Correctly output as a Blob

        // Create a temporary link and trigger download
        const url = URL.createObjectURL(pdfOutput);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HealthReport_${record.ScoresID}.pdf`;
        link.click();

        // Revoke the object URL after download
        URL.revokeObjectURL(url);
        Alert.alert('Report Generated', 'Your report has been downloaded.');
      } catch (error) {
        console.error('Error generating PDF:', error);
        Alert.alert('Error', 'There was an error generating the PDF. Please try again.');
      }
    } else {
      try {
        // For Android: Generate PDF using jsPDF and save it to file system
        const doc = new jsPDF();
        doc.text(reportContent, 10, 10); // Position of text in the PDF
        
        // Convert the PDF output to a base64-encoded string
        const pdfBase64 = doc.output('datauristring'); // This gives us a base64 string that we can store

        // Save the PDF to the file system
        const pdfPath = `${FileSystem.documentDirectory}HealthReport_${record.ScoresID}.pdf`;
        await FileSystem.writeAsStringAsync(pdfPath, pdfBase64.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64
        });

        // Share the PDF file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(pdfPath);
        } else {
          Alert.alert('Sharing Not Available', 'Your device does not support sharing.');
        }
      } catch (error) {
        console.error('Error saving or sharing the PDF:', error);
        Alert.alert('Error', 'An error occurred while saving or sharing the PDF.');
      }
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push('tabs/profile')}>
            <Image source={require('../../assets/icons/triangle.png')} style={styles.userImage} />
          </TouchableOpacity>
          <Text style={styles.username}>{username}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('auth/sign-in')}>
          <Image source={require('../../assets/icons/logout.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

     <View style={styles.healthScoreContainer}>
        <AnimatedCircularProgress
  size={85}
  width={6}
  fill={currentHealthScore} // Dynamic fill value
  tintColor={getBarColor(currentHealthScore)} // Dynamic color based on score
  backgroundColor="#e0e0e0"
>
  {() => (
    <Text style={styles.healthScore}>
      {Math.round(currentHealthScore)}%
    </Text>
  )}
</AnimatedCircularProgress>
        <Text style={styles.healthScoreText}>       Your Current Health Score</Text>
      </View>

      <TouchableOpacity
  onPress={() => {
    setRefresh(prev => !prev); // Toggle the refresh state
    router.push('tabs/calculate'); // Navigate to the Calculate page
  }}
  style={styles.newScreeningContainer}
>
  <Text style={styles.newScreeningText}>+ New Screening</Text>
</TouchableOpacity>

      <Text style={styles.recentRecordsTitle}>Recent Records</Text>
      <View style={styles.recordsContainer}>
        {scores.map((record) => (
          <View key={record.ScoresID} style={styles.recordItem}>
            <Text style={styles.recordDate}>{formatDate(record.Date)}</Text>
            <Text style={styles.recordScore}>Score: {record.Overall_score.toFixed()}</Text>
            <TouchableOpacity onPress={() => saveAndShareFile(record)}>
  <Image source={require('../../assets/icons/report.png')} style={styles.reportIcon} />
</TouchableOpacity>

          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;


const styles = StyleSheet.create({
  container: {
    padding: width * 0.04, // Dynamic padding based on screen width
    backgroundColor: '#f5f5f5',
    paddingBottom:height*0.15
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02, // Dynamic margin based on screen height
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: width * 0.12, // Dynamic width based on screen width
    height: width * 0.12, // Dynamic height based on screen width
    borderRadius: width * 0.06, // Circular image, half of width/height
    marginRight: width * 0.03, // Dynamic margin
  },
  welcomeText: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    width: width * 0.08, // Adjust icon size responsively
    height: width * 0.08,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.002, // Dynamic margin
    padding: width * 0.04, // Dynamic padding
    backgroundColor: '#002244',
    borderRadius: 12,
    elevation: 3,
    height: height * 0.15,
  },
  circularContainer: {
    width: width * 0.2, // Dynamic size based on screen width
    height: width * 0.2,
    borderRadius: width * 0.2,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04, // Dynamic margin
  },
  healthScore: {
    fontSize: width * 0.07, // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
  },
  healthScoreText: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
  },
  
  newScreeningContainer: {
    marginTop: height * 0.02, // Dynamic margin
    backgroundColor: '#32CD32',
    borderRadius: 8,
    paddingVertical: height * 0.02, // Dynamic padding
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  newScreeningText: {
    fontSize: width * 0.05, // Responsive font size
    color: '#fff',
  },
  recentRecordsTitle: {
    marginTop: height * 0.03, // Dynamic margin
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.002, // Dynamic margin
  },
  recordsContainer: {
    marginTop: height * 0.01, // Dynamic margin
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.04, // Dynamic padding
    marginBottom: height * 0.02, // Dynamic margin
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  recordDate: {
    fontSize: width * 0.04, // Responsive font size
    color: '#555',
    flex: 2,
  },
  recordScore: {
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  reportIcon: {
    width: width * 0.08, // Adjust icon size responsively
    height: width * 0.08,
  },
  reportContainer: {
    marginTop: height*0.02,
    width: '100%',
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 5,
  },
  reportHeader: {
    fontSize: width*0.06,
    fontWeight: 'bold',
    color: '#007acc',
    marginBottom: height*0.01,
  },
  categoryItem: {
    padding: 12,
    marginBottom: height*0.01,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  categoryText: {
    fontSize: width*0.04,
    color: '#333',
  },
  overallscoreText:{
    fontSize: width * 0.06, // Responsive font size
    color: 'white',
    textAlign:"center",
    
  },
  overallscoreContainer:{
    marginTop: height * 0.01, // Dynamic margin
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    margin:width*0.3,
    height:height*0.055,
    marginBottom:height*0.01
  }
});

