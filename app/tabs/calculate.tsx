import React, { useState, useRef, useEffect,useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const RESPONSIVE_PADDING = width * 0.05; // 5% padding
const BUTTON_WIDTH = width * 0.27; // 30% of screen width
const CALCULATE_BUTTON_WIDTH = width * 0.6; // 30% of screen width
const PROFILE_IMAGE_SIZE = width * 0.15; // Profile image is 15% of screen width

type FormData = {
  [key: string]: string;
};

type Field = {
  label: string;
  key: string;
  placeholder: string;
  type?: 'select';
  options?: string[];
};

type Category = {
  title: string;
  fields: Field[];
};


const Calculate =  () => {

    const [scores, setScores] = useState(null);
    const [gender, setGender] = useState('');
    const [age, setAge] = useState("");
    const [currentCategory, setCurrentCategory] = useState(0);
    const [username, setusername] = useState<String>("");
    const [refresh, setRefresh] = useState(false);
    const fixuser=async()=>{
     setusername((await AsyncStorage.getItem('username')) ?? '');
  }
  useFocusEffect(
      useCallback(() => {
         fixuser()
      }, [])
    );
    // setusername((await AsyncStorage.getItem('username')) ?? '');
    // const [showGenderPicker, setShowGenderPicker] = useState(false);
    // const [currentPickerField, setCurrentPickerField] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
      height: '',
      weight: '',
      bmi:'',
      bp: '',
      heartrate:'',
      temperature: '',
      earWax: 'Select',
      otitismedia:'Select',
      audiometry: 'Select',
      tonsils:'Select',
      nasalStructure: 'Select',
      color:'',
      myopiaL: 'Select',
      myopiaR: 'Select',
      hyperopiaL: 'Select',
      hyperopiaR: 'Select',
      squinteyes: 'Select',
      teethCondition: 'Select',
      oralHygiene: 'Select',
      dentalCavities: 'Select',
      discolor:'Select',
      skinCondition: 'Select',
      swelling:'Select',
      headneck:'Select',
      cnsCondition: 'Select',
      malnutrition: 'Select',
      gisystems:'Select',
      alertness: '',
      eyeContact: '',
      generalBehavior: '',
      gender: 'Select',
    });
  
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [showFieldPicker, setShowFieldPicker] = useState(false);
    const [currentPickerField, setCurrentPickerField] = useState<string | null>(null);
  
    const router = useRouter();
    
    
    const handleprofilelogo = () => {
          router.push('tabs/profile'); // Navigate to profile page
    };
  
    const categories: Category[] = [
      {
        title: 'Vital Statistics',
        fields: [
          { label: 'Height:', key: 'height', placeholder: 'Enter height in cm' },
          { label: 'Weight:', key: 'weight', placeholder: 'Enter weight in kg' },
          { label: 'BMI:', key: 'bmi', placeholder: 'Enter BMI' },
          { label: 'Blood Pressure:', key: 'bp', placeholder: 'Enter systolic BP' },
          { label: 'Heart Rate:', key: 'heartrate', placeholder: 'Enter Heart Rate' },
          { label: 'Temperature:', key: 'temperature', placeholder: 'Enter temperature in °F' },
        ],
      },
      {
        title: 'ENT',
        fields: [
          { label: 'Ear Wax:', key: 'earWax', placeholder: 'Select ear wax level', type: 'select', options: ['Select', 'Absent', 'Mild', 'Moderate', 'Severe'] },
          { label: 'Otitis Media:', key: 'otitismedia', placeholder: 'Select otitis media condition', type: 'select', options: ['Select', 'Normal', 'Mild', 'Moderate', 'Severe', 'Chronic'] },
          { label: 'Audiometry:', key: 'audiometry', placeholder: 'Select audiometry level', type: 'select', options: ['Select', '10', '8-9', '6-7', '<6'] },
          { label: 'Tonsils:', key: 'tonsils', placeholder: 'Select tonsils condition', type: 'select', options: ['Select', 'Normal', 'Mildly enlarged', 'Moderately enlarged', 'Severely enlarged', 'Chronic'] },
          { label: 'Nasal Structure:', key: 'nasalStructure', placeholder: 'Select nasal structure condition', type: 'select', options: ['Select', 'Normal Deviation', 'Minimal Deviation', 'Mild Deviation', 'Severe Deviation'] },
        ],
      },
      {
        title: 'Vision',
        fields: [
          { label: 'Color Blindness:', key: 'color', placeholder: 'Enter Blindness score' },
          { label: 'Myopia(Left):', key: 'myopiaL', placeholder: 'Select Myopia Range(Left)', type: 'select', options: ['Select', '6/6', '6/12', '6/18', '6/24', '6/36 or worse'] },
          { label: 'Myopia(Right):', key: 'myopiaR', placeholder: 'Select Myopia Range(Right)', type: 'select', options: ['Select', '6/6', '6/12', '6/18', '6/24', '6/36 or worse'] },
          { label: 'Hyperopia(Left):', key: 'hyperopiaL', placeholder: 'Select Hyperopia Range(Left)', type: 'select', options: ['Select', '6/6', '6/12', '6/18', '6/24', '6/36 or worse'] },
          { label: 'Hyperopia(Right):', key: 'hyperopiaR', placeholder: 'Select Hyperopia Range(Right)', type: 'select', options: ['Select', '6/6', '6/12', '6/18', '6/24', '6/36 or worse'] },
          { label: 'Squint Eyes:', key: 'squinteyes', placeholder: 'Select Squint Category', type: 'select', options: ['Select', 'No Squint', 'Slight Squint','Noticeable Squint', 'Alternating Squint', 'Severe Squint'] },
        ],
      },
      {
        title: 'Oral Health',
        fields: [
          { label: 'Well formed teeth:', key: 'teethCondition', placeholder: 'Select teeth condition', type: 'select', options: ['Select', 'Yes', 'No(Malocclusion)'] },
          { label: 'Oral Hygiene:', key: 'oralHygiene', placeholder: 'Select oral hygiene level', type: 'select', options: ['Select', 'Excellent', 'Good', 'Fair', 'Poor'] },
          { label: 'Dental Cavities:', key: 'dentalCavities', placeholder: 'Select cavity status', type: 'select', options: ['Select', 'Absent', 'Mild', 'Multiple', 'Severe'] },
          { label: 'Discoloration:', key: 'discolor', placeholder: 'Enter discoloration condition', type: 'select', options: ['Select', 'Yes', 'No'] },
        ],
      },
      {
        title: 'Physical Health',
        fields: [
          { label: 'Skin:', key: 'skinCondition', placeholder: 'Select skin condition', type: 'select', options: ['Select', 'Healthy', 'Slight Issues', 'Mild Issues', 'Moderate Issues', 'Severe Issues'] },
          { label: 'Swelling:', key: 'swelling', placeholder: 'Select swelling condition', type: 'select', options: ['Select', 'Absent', 'Mild swelling', 'Moderate swelling', 'Severe swelling', 'Persistent swelling'] },
          { label: 'Head & Neck:', key: 'headneck', placeholder: 'Select Head&Neck condition', type: 'select', options: ['Select', 'Normal', 'Mild Abnormalities', 'Moderate Abnormalities', 'Severe Abnormalities', 'Absent'] },
          { label: 'CNS:', key: 'cnsCondition', placeholder: 'Select CNS condition', type: 'select', options: ['Select', 'Normal', 'Mild Dysfunction', 'Moderate Dysfunction', 'Severe Dysfunction', 'Absent'] },
          { label: 'Malnutrition:', key: 'malnutrition', placeholder: 'Select malnutrition level', type: 'select', options: ['Select', 'Absent', 'Slight Malnutrition', 'Mild Malnutrition', 'Moderate Malnutrition', 'Severe Malnutrition'] },
          { label: 'GI Systems:', key: 'gisystems', placeholder: 'Select GI condition', type: 'select', options: ['Select', 'Normal', 'Mild Issues', 'Moderate Issues', 'Severe Issues', 'Absent'] },
        ],
      },
      {
        title: 'Mental Wellness',
        fields: [
          { label: 'Alertness:', key: 'alertness', placeholder: 'eg : focused, attentive, distracted' },
          { label: 'Eye Contact:', key: 'eyeContact', placeholder: 'eg : sharp, distracted' },
          { label: 'General Behavior:', key: 'generalBehavior', placeholder: 'eg : cooperative, humble, friendly' },
        ],
      },
    ];
  
    const handleNext = () => {
      if (currentCategory < categories.length - 1) {
        setCurrentCategory(currentCategory + 1);
      }
    };
  
    const handleSkip = () => {
      if (currentCategory < categories.length - 1) {
        setCurrentCategory(currentCategory + 1); // Skip to next category
      }
    };
  
    const handleBack = () => {
      if (currentCategory === 0) {
        router.push('tabs/home'); // Navigate to home page on the first category
      } else if (currentCategory > 0) {
        setCurrentCategory(currentCategory - 1);
      }
    };
  
    const handleOverallScore = async (event: { preventDefault: () => void; }) => {
      
      event.preventDefault(); 
    //   try {
    //   router.push("tabs/score");
    // } catch (error) {
    //   console.error("Error in handleOverallScore:", error);
    // }
  
      //----------------------------------VITAL STATISTICS--------------------------------------
      // 1. Height & Weight (as one combined parameter for Growth Index)
  const height = parseInt(formData['height']);
  const weight = parseInt(formData['weight']);
  let growth_index_score = 0;
  let valid_parameters = 5;
  
  // Check for invalid parameters
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      growth_index_score = 0; // If invalid, set score to 0
      valid_parameters -= 1;  // Remove 1 from valid parameters
  } else {
      const height_mean = 140;
      const height_sd = 8;
      const weight_mean = 32;
      const weight_sd = 5;
  
      // z-scores for height and weight
      const height_z = (height - height_mean) / height_sd;
      const weight_z = (weight - weight_mean) / weight_sd;
  
      // height and weight z-scores into a Growth Index
      const growth_index = (height_z + weight_z) / 2;
      if (-1 <= growth_index && growth_index <= 1) {
          growth_index_score = 1;
      } else if (1 < growth_index && growth_index <= 2) {
          growth_index_score = 2;
      } else if (-2 <= growth_index && growth_index < -1) {
          growth_index_score = 3;
      } else {
          growth_index_score = 4;
      }
  }
  
  // console.log("Growth Index Score: ", growth_index_score);
  
  // 2. BMI
  const bmi = parseInt(formData['bmi']);
  let bmi_score = 0;
  if (isNaN(bmi) || bmi <= 0) {
      bmi_score = 0;
      valid_parameters -= 1;  // Remove 1 from valid parameters
  } else if (18.5 <= bmi && bmi <= 24.9) {
      bmi_score = 1;
  } else if (bmi < 18.5) {
      bmi_score = 3;
  } else if (25 <= bmi && bmi <= 29.9) {
      bmi_score = 2;
  } else {
      bmi_score = 4;
  }
  
  // console.log("BMI Score: ", bmi_score);
  
  // 3. Blood Pressure
  const bp_systolic = parseInt(formData['bp']);
  let bp_score = 0;
  if (isNaN(bp_systolic) || bp_systolic <= 0) {
      bp_score = 0;
      valid_parameters -= 1;  // Remove 1 from valid parameters
  } else if (90 <= bp_systolic && bp_systolic <= 120) {
      bp_score = 1;
  } else if (121 <= bp_systolic && bp_systolic <= 130) {
      bp_score = 2;
  } else if (131 <= bp_systolic && bp_systolic <= 140) {
      bp_score = 3;
  } else {
      bp_score = 4;
  }
  
  // console.log("Blood Pressure Score: ", bp_score);
  
  // 4. Heart Rate
  const heart_rate = parseInt(formData['heartrate']);
  let heart_rate_score = 0;
  if (isNaN(heart_rate) || heart_rate <= 0) {
      heart_rate_score = 0;
      valid_parameters -= 1;  // Remove 1 from valid parameters
  } else if (60 <= heart_rate && heart_rate <= 100) {
      heart_rate_score = 1;
  } else if (101 <= heart_rate && heart_rate <= 110) {
      heart_rate_score = 2;
  } else if (111 <= heart_rate && heart_rate <= 120) {
      heart_rate_score = 3;
  } else {
      heart_rate_score = 4;
  }
  
  // console.log("Heart Rate Score: ", heart_rate_score);
  
  // 5. Temperature
  const temperature = parseInt(formData['temperature']);
  let temp_score = 0;
  if (isNaN(temperature) || temperature <= 0) {
      temp_score = 0;
      valid_parameters -= 1;  // Remove 1 from valid parameters
  } else if (97.8 <= temperature && temperature <= 99.1) {
      temp_score = 1;
  } else if (99.2 <= temperature && temperature <= 100.4) {
      temp_score = 2;
  } else if (100.5 <= temperature && temperature <= 101.4) {
      temp_score = 3;
  } else {
      temp_score = 4;
  }
  
  // console.log("Temperature Score: ", temp_score);
  
  // Overall General Health Score Calculation:
  const total_score = growth_index_score + bmi_score + bp_score + heart_rate_score + temp_score;
  
  let General_Health_Score = 0;
  
  if (valid_parameters > 0 && total_score > 0) {
      // Calculate General Health Score based on valid parameters
      General_Health_Score = (valid_parameters / total_score) * (20 * valid_parameters);
  }
  
  // Store the General Health Score
  await AsyncStorage.setItem('General_Health_Score', General_Health_Score.toFixed());
  
  console.log("Final General Health Score: ", General_Health_Score);
  
  
      //----------------------------------ENT--------------------------------------
     // Assuming formData contains the parameters and their scores
  const earwax_level = formData['earWax'];
  const otitis_media_condition = formData['otitismedia'];
  const audiometry = formData['audiometry'];
  const tonsil_condition = formData['tonsils'];
  const nasal_structure = formData['nasalStructure'];
  
  let earwax_score = 0, otitis_media_score = 0, audiometry_score = 0, tonsil_score = 0, nasal_score = 0;
  let ENT_Score=0;
  
  // Set earwax score
  if (earwax_level === null || earwax_level === "none") {
    earwax_score = 0;
  } else if (earwax_level == "Absent") {
    earwax_score = 1;
  } else if (earwax_level == "Mild") {
    earwax_score = 2;
  } else if (earwax_level == "Moderate") {
    earwax_score = 3;
  } else if(earwax_level=="Severe"){
    earwax_score = 4;
  }
  
  // Set otitis media score
  if (otitis_media_condition === null || otitis_media_condition === "none") {
    otitis_media_score = 0;
  } else if (otitis_media_condition == "Normal") {
    otitis_media_score = 1;
  } else if (otitis_media_condition == "Mild") {
    otitis_media_score = 2;
  } else if (otitis_media_condition == "Moderate") {
    otitis_media_score = 3;
  } else if (otitis_media_condition == "Severe") {
    otitis_media_score = 4;
  } else if(otitis_media_condition=="Chronic"){
    otitis_media_score = 5;
  }
  
  // Set audiometry score
  if (audiometry === null || audiometry === "none") {
    audiometry_score = 0;
  } else if (audiometry == '10') {
    audiometry_score = 1;
  } else if (audiometry == "8-9") {
    audiometry_score = 2;
  } else if (audiometry == "6-7") {
    audiometry_score = 3;
  } else if(audiometry=="<6"){
    audiometry_score = 4;
  }
  
  // Set tonsil score
  if (tonsil_condition === null || tonsil_condition === "none") {
    tonsil_score = 0;
  } else if (tonsil_condition == "Normal") {
    tonsil_score = 1;
  } else if (tonsil_condition == "Mildly enlarged") {
    tonsil_score = 2;
  } else if (tonsil_condition == "Moderately enlarged") {
    tonsil_score = 3;
  } else if (tonsil_condition == "Severely enlarged") {
    tonsil_score = 4;
  } else if(tonsil_condition=="Chronic"){
    tonsil_score = 5;
  }
  
  // Set nasal score
  if (nasal_structure === null || nasal_structure === "none") {
    nasal_score = 0;
  } else if (nasal_structure == "Normal Deviation") {
    nasal_score = 1;
  } else if (nasal_structure == "Minimal Deviation") {
    nasal_score = 2;
  } else if (nasal_structure == "Mild Deviation") {
    nasal_score = 3;
  } else if(nasal_structure=="Severe Deviation"){
    nasal_score = 4;
  }
  
  
  // Weights for each parameter
  const weights = {
    earwax: 0.1,  // 10%
    otitis_media: 0.2,  // 20%
    audiometry: 0.4,  // 40%
    tonsil: 0.2,  // 20%
    nasal: 0.1,  // 10%
  };
  
  // Initialize variables
  let total_score1=0;
  
  // Function to calculate contribution based on score
  function calculateContributionearwax(score: number, weight: number) {
    let contribution = 0;
    
    switch (score) {
      case 1:
        contribution = weight;  // full weight for score 1
        break;
      case 2:
        contribution = weight - (weight * 0.25);  // 2.5% less for score 2
        break;
      case 3:
        contribution = weight - (weight * 0.5);  // 5% less for score 3
        break;
      case 4:
        contribution = weight - (weight * 0.75);  // 7.5% less for score 4
        break;
      default:
        contribution = 0;  // no contribution if score is not valid
    }
    return contribution;
  }
  
  function calculateContributionotitis(score: number, weight: number) {
    let contribution1 = 0;
    
    switch (score) {
      case 1:
        contribution1 = weight;  // full weight for score 1
        break;
      case 2:
        contribution1 = weight - (weight * 0.2);  // 2% less for score 2
        break;
      case 3:
        contribution1 = weight - (weight * 0.4);  // 4% less for score 3
        break;
      case 4:
        contribution1 = weight - (weight * 0.6);  // 6% less for score 4
        break;
      case 5:
        contribution1 = weight - (weight * 0.8);  // 8% less for score 4
        break;
      default:
        contribution1 = 0;  // no contribution if score is not valid
    }
    return contribution1;
  }
  
  function calculateContributionaudiometry(score: number, weight: number) {
    let contribution2 = 0;
  
    switch (score) {
      case 1:
        contribution2 = weight;  // full weight for score 1
        break;
      case 2:
        contribution2 = weight - (weight * 0.25);  // 2.5% less for score 2
        break;
      case 3:
        contribution2 = weight - (weight * 0.5);  // 5% less for score 3
        break;
      case 4:
        contribution2 = weight - (weight * 0.75);  // 7.5% less for score 4
        break;
      default:
        contribution2 = 0;  // no contribution if score is not valid
    }
    return contribution2;
  }
  
  function calculateContributiontonsil(score: number, weight: number) {
    let contribution3 = 0;
    
    switch (score) {
      case 1:
        contribution3 = weight;  // full weight for score 1
        break;
      case 2:
        contribution3 = weight - (weight * 0.2);  // 2% less for score 2
        break;
      case 3:
        contribution3 = weight - (weight * 0.4);  // 4% less for score 3
        break;
      case 4:
        contribution3 = weight - (weight * 0.6);  // 6% less for score 4
        break;
      case 5:
        contribution3 = weight - (weight * 0.8);  // 8% less for score 4
        break;
      default:
        contribution3 = 0;  // no contribution if score is not valid
    }
    return contribution3;
  }
  
  function calculateContributionnasal(score: number, weight: number) {
    let contribution4 = 0;
    
    switch (score) {
      case 1:
        contribution4 = weight;  // full weight for score 1
        break;
      case 2:
        contribution4 = weight - (weight * 0.25);  // 2.5% less for score 2
        break;
      case 3:
        contribution4 = weight - (weight * 0.5);  // 5% less for score 3
        break;
      case 4:
        contribution4 = weight - (weight * 0.75);  // 7.5% less for score 4
        break;
      default:
        contribution4 = 0;  // no contribution if score is not valid
    }
    return contribution4;
  }
  
  // Handling cases for each parameter (1 to 4)
  
     total_score1 = 0;
  
  if (earwax_score > 0) {
    total_score1 += calculateContributionearwax(earwax_score, weights.earwax); // Should add 0.1
  } 
  
  if (otitis_media_score > 0) {
    total_score1 += calculateContributionotitis(otitis_media_score, weights.otitis_media); // Should add 0.2
  } 
  
  if (audiometry_score > 0) {
    total_score1 += calculateContributionaudiometry(audiometry_score, weights.audiometry); // Should add 0.4
  } 
  
  if (tonsil_score > 0) {
    total_score1 += calculateContributiontonsil(tonsil_score, weights.tonsil); // Should add 0.2
  } 
  
  if (nasal_score > 0) {
    total_score1 += calculateContributionnasal(nasal_score, weights.nasal); // Should add 0.1
  }
  
  
    // Adjust the ENT Score based on valid parameters
        ENT_Score = (total_score1)*100;  // Calculate the final score as a percentage
  
    // Save the final ENT score to AsyncStorage
  await AsyncStorage.setItem('ENT_Score', ENT_Score.toFixed());
  
  console.log("Final ENT Score: ", ENT_Score);
  
  
      //----------------------------------VISION--------------------------------------
  
  let valid_vision_parameters=6;
      // 1. Color Blindness
      const color_blindness_score = parseInt(formData['color'])
      let final_color_blindness_score = 0;
      const calculate_color_blindness_score = (score: number) => {
          if (isNaN(score)|| score === 0) {
              valid_vision_parameters-=1;
              return 0;
          }
          if (12 <= score && score<= 15){
              return 1  
          }
          else if(9 <= score && score<= 11){
              return 2  
          }
          else if(6 <= score && score<= 8){
              return 3   
          }
          else if(3 <= score && score<= 5){
              return 4   
          }
          else if(1 <= score && score<= 2) {
              return 5   
          }
          else{
            valid_vision_parameters-=1;
            return 0
          } 
      }
          final_color_blindness_score +=  calculate_color_blindness_score(color_blindness_score)
          console.log('final_color_blindness_score: ',final_color_blindness_score)
      // 2. Myopia
  
      const right_eye_vision = formData['myopiaR']
      const left_eye_vision = formData['myopiaL']
      let myopia_score = 0;
      const calculate_myopia_score = (vision: string) =>{
        if (!vision ||vision==="none") {
          valid_vision_parameters-=1;
          return 0;
        }
          if(vision == "6/6"){
              return 1 
          }
          else if (vision == "6/12") {
              return 2  
          }
          else if (vision == "6/18") {
              return 3   
          }
          else if (vision == "6/24") {
              return 4   
          }
          else if(vision=="6/36 or worse"){
              return 5  
          }
          else{
            valid_vision_parameters-=1;
            return 0
            }
      }
  
      myopia_score += calculate_myopia_score(right_eye_vision)
      myopia_score += calculate_myopia_score(left_eye_vision)
      console.log('myopia_score: ',myopia_score)
  
  
      // 3. Hyperopia
      
      const right_eye_visionh = formData['hyperopiaR']
      const left_eye_visionh = formData['hyperopiaL']
      let hyperopia_score = 0;
      const calculate_hyperopia_score = (vision: string) =>{
          if (!vision || vision==="none") {
              valid_vision_parameters-=1;
              return 0;
          }
          if(vision == "6/6"){
              return 1  
          }
          else if (vision == "6/12") {
              return 2   
          }
          else if (vision == "6/18") {
              return 3   
          }
          else if (vision == "6/24") {
              return 4   
          }
          else if(vision=="6/36 or worse"){
              return 5  
          }
          else{
            valid_vision_parameters-=1;
            return 0
            }
      }
  
      hyperopia_score += calculate_hyperopia_score(right_eye_visionh)
      hyperopia_score += calculate_hyperopia_score(left_eye_visionh)
          console.log('hyperopia_score: ',hyperopia_score)
      
  
      // 4. Squint Eyes
      const squint_status = formData['squinteyes']
      let squint_score = 0;
      const calculate_squint_score = (status:string) => {
        if (!status|| status==="none") {
              valid_vision_parameters-=1;
              return 0;
          }
          if (status == "No Squint"){
              return 1  
          }
          else if (status == "Slight Squint"){
              return 2
          }
          else if (status == "Noticeable Squint"){
              return 3
          }
          else if (status == "Alternating Squint"){
              return 4
          }
          else if (status == "Severe Squint"){
              return 5
          }
          else{
            valid_vision_parameters-=1;
            return 0
            }
        }
    
      squint_score = calculate_squint_score(squint_status)
          console.log('squint_score: ',squint_score)
  
      let Vision_score=0
      if(valid_vision_parameters!=0)
      {
        const dup=(valid_vision_parameters)/(final_color_blindness_score+myopia_score+hyperopia_score+squint_score)
        Vision_score = dup *(valid_vision_parameters* 16.6666)
        console.log("Final Vision Score:", Vision_score)
  
        await AsyncStorage.setItem('Vision_score',Vision_score.toFixed())
      }
      else{
        const dup=0
        Vision_score = dup *(valid_vision_parameters* 16.6666)
        console.log("Final Vision Score:", Vision_score)
  
        await AsyncStorage.setItem('Vision_score',Vision_score.toFixed())
      }
  
  
      //----------------------------------ORAL HEALTH--------------------------------------
      // 1.Well formed teeth
      const well_formed_teeth = formData['teethCondition'];
      const oral_hygiene = formData['oralHygiene'];
      const dental_caries = formData['dentalCavities'];
      const discoloration = formData['discolor'];
  
      let teeth_score = 0, hygiene_score = 0, caries_score = 0, discoloration_score = 0;
      let Oral_score = 0;
  
      // Set teeth score
        if (well_formed_teeth === null || well_formed_teeth === "Select") {
            teeth_score = 0;
        } else if (well_formed_teeth === "Yes") {
            teeth_score = 1; // Full weight
        } else if (well_formed_teeth === "No(Malocclusion)") {
            teeth_score = 2; // Reduced weight
        }
  
      // Set oral hygiene score
      if (oral_hygiene === null || oral_hygiene === "Select") {
            hygiene_score = 0;
      } else if (oral_hygiene === "Excellent") {
            hygiene_score = 1;
      } else if (oral_hygiene === "Good") {
            hygiene_score = 2;
      } else if (oral_hygiene === "Fair") {
            hygiene_score = 3;
      } else if (oral_hygiene === "Poor") {
            hygiene_score = 4;
      }
  
      // Set dental caries score
      if (dental_caries === null || dental_caries === "Select") {
        caries_score = 0;
      } else if (dental_caries === "Absent") {
        caries_score = 1;
      } else if (dental_caries === "Mild") {
        caries_score = 2;
      } else if (dental_caries === "Multiple") {
        caries_score = 3;
      } else if (dental_caries === "Severe") {
        caries_score = 4;
      }
  
      // Set discoloration score
      if (discoloration === null || discoloration === "Select") {
        discoloration_score = 0;
      } else if (discoloration === "No") {
        discoloration_score = 1;
      } else if (discoloration === "Yes") {
        discoloration_score = 2;
      }
  
      // Weights for each parameter
      const oral_weights = {
        teeth: 0.25,       // 25%
        hygiene: 0.30,     // 30%
        caries: 0.30,      // 30%
        discoloration: 0.15, // 15%
      };
  
      // Function to calculate contribution based on score
      function calculateContributionteeth(score: number, weight: number) {
      let contribution = 0;
  
    switch (score) {
      case 1:
        contribution = weight; // Full weight for score 1
        break;
      case 2:
        contribution = weight - (weight * 0.5); // 50% reduction
        break;
      default:
        contribution = 0; // No contribution if score is not valid
    }
    return contribution;
  }
  
      function calculateContributionhygiene(score: number, weight: number) {
      let contribution = 0;
  
    switch (score) {
      case 1:
        contribution = weight; // Full weight for score 1
        break;
      case 2:
        contribution = weight - (weight * 0.25); // 25% reduction
        break;
      case 3:
        contribution = weight - (weight * 0.5); // 50% reduction
        break;
      case 4:
        contribution = weight - (weight * 0.75); // 75% reduction
        break;
      default:
        contribution = 0; // No contribution if score is not valid
    }
    return contribution;
  }
  
       function calculateContributioncaries(score: number, weight: number) {
      let contribution = 0;
  
    switch (score) {
      case 1:
        contribution = weight; // Full weight for score 1
        break;
      case 2:
        contribution = weight - (weight * 0.25); // 25% reduction
        break;
      case 3:
        contribution = weight - (weight * 0.5); // 50% reduction
        break;
      case 4:
        contribution = weight - (weight * 0.75); // 75% reduction
        break;
      default:
        contribution = 0; // No contribution if score is not valid
    }
    return contribution;
  }
  
       function calculateContributiondiscolor(score: number, weight: number) {
      let contribution = 0;
  
    switch (score) {
      case 1:
        contribution = weight; // Full weight for score 1
        break;
      case 2:
        contribution = weight - (weight * 0.5); // 50% reduction
        break;
      default:
        contribution = 0; // No contribution if score is not valid
    }
    return contribution;
  }
      // Calculate total oral score
      let total_oral_score = 0;
  
      if (teeth_score > 0) {
        total_oral_score += calculateContributionteeth(teeth_score, oral_weights.teeth);
        // console.log("After teeth:", total_oral_score);
      }
  
      if (hygiene_score > 0) {
        total_oral_score += calculateContributionhygiene(hygiene_score, oral_weights.hygiene);
        // console.log("After hygiene:", total_oral_score);
      }
  
      if (caries_score > 0) {
        total_oral_score += calculateContributioncaries(caries_score, oral_weights.caries);
        // console.log("After caries:", total_oral_score);
      }
  
      if (discoloration_score > 0) {
        total_oral_score += calculateContributiondiscolor(discoloration_score, oral_weights.discoloration);
        // console.log("After discoloration:", total_oral_score);
      }
  
      // Adjust the Oral Score based on valid parameters
      Oral_score = total_oral_score * 100; // Calculate the final score as a percentage
  
      // Save the final Oral score to AsyncStorage
      await AsyncStorage.setItem('Oral_score', Oral_score.toFixed());
  
      console.log("Final Oral Score: ", Oral_score);
  
  
      //----------------------------------PHYSICAL HEALTH--------------------------------------
   
      // Weights for each parameter
      const weightsphysical = {
        skin: 0.10,  // 10%
        swelling: 0.15,  // 15%
        head_neck: 0.20,  // 20%
        cns: 0.25,  // 25%
        malnutrition: 0.20,  // 20%
        gi: 0.10,  // 10%
      };
  
      // 1. Skin
      const skin_status = formData['skinCondition'];
      let skin_score = 0;
  
      skin_score = calculate_skin_score(skin_status);
  
      // 2. Swelling
      const swelling = formData['swelling'];
      let swelling_score = 0;
  
      swelling_score = calculate_swelling_score(swelling);
  
      // 3. Head&Neck
      const head_neck = formData['headneck'];
      let head_neck_score = 0;
  
      head_neck_score = calculate_head_neck_score(head_neck);
  
      // 4. CNS
      const cns_system = formData['cnsCondition'];
      let cns_score = 0;
  
      cns_score = calculate_cns_score(cns_system);
  
      // 5. Malnutrition
      const malnutrition_status = formData['malnutrition'];
      let malnutrition_score = 0;
  
      malnutrition_score = calculate_malnutrition_score(malnutrition_status);
  
      // 6. GI Systems
      const gi_status = formData['gisystems'];
      let gi_score = 0;
  
      gi_score = calculate_gi_score(gi_status);
  
      // Initialize total score variable for Physical Health
      let total_physical_health_score = 0;
  
      // Function to calculate contribution based on score for each parameter
      function calculate_skin_score(score: string) {
        let skin_contribution = 0;
        
        switch (score) {
          case 'Healthy':
            skin_contribution = weightsphysical.skin;
            break;
          case 'Slight Issues':
            skin_contribution = weightsphysical.skin - (weightsphysical.skin * 0.20);
            break;
          case 'Mild Issues':
            skin_contribution = weightsphysical.skin - (weightsphysical.skin * 0.40);
            break;
          case 'Moderate Issues':
            skin_contribution = weightsphysical.skin - (weightsphysical.skin * 0.60);
            break;
          case 'Severe Issues':
            skin_contribution = weightsphysical.skin - (weightsphysical.skin * 0.80);
            break;
          default:
            skin_contribution = 0;
        }
  
        return skin_contribution;
      }
  
      function calculate_swelling_score(score: string) {
        let swelling_contribution = 0;
  
        switch (score) {
          case 'Absent':
            swelling_contribution = weightsphysical.swelling;
            break;
          case 'Mild swelling':
            swelling_contribution = weightsphysical.swelling - (weightsphysical.swelling * 0.20);
            break;
          case 'Moderate swelling':
            swelling_contribution = weightsphysical.swelling - (weightsphysical.swelling * 0.40);
            break;
          case 'Severe swelling':
            swelling_contribution = weightsphysical.swelling - (weightsphysical.swelling * 0.60);
            break;
          case 'Persistent swelling':
            swelling_contribution = weightsphysical.swelling - (weightsphysical.swelling * 0.80);
            break;
          default:
            swelling_contribution = 0;
        }
  
        return swelling_contribution;
      }
  
      function calculate_head_neck_score(score: string) {
        let head_neck_contribution = 0;
  
        switch (score) {
          case 'Normal':
            head_neck_contribution = weightsphysical.head_neck;
            break;
          case 'Mild Abnormalities':
            head_neck_contribution = weightsphysical.head_neck - (weightsphysical.head_neck * 0.20);
            break;
          case 'Moderate Abnormalities':
            head_neck_contribution = weightsphysical.head_neck - (weightsphysical.head_neck * 0.40);
            break;
          case 'Severe Abnormalities':
            head_neck_contribution = weightsphysical.head_neck - (weightsphysical.head_neck * 0.60);
            break;
          case 'Absent':
            head_neck_contribution = weightsphysical.head_neck - (weightsphysical.head_neck * 0.80);
            break;
          default:
            head_neck_contribution = 0;
        }
  
        return head_neck_contribution;
      }
  
      function calculate_cns_score(score: string) {
        let cns_contribution = 0;
  
        switch (score) {
          case 'Normal':
            cns_contribution = weightsphysical.cns;
            break;
          case 'Mild Dysfunction':
            cns_contribution = weightsphysical.cns - (weightsphysical.cns * 0.20);
            break;
          case 'Moderate Dysfunction':
            cns_contribution = weightsphysical.cns - (weightsphysical.cns * 0.40);
            break;
          case 'Severe Dysfunction':
            cns_contribution = weightsphysical.cns - (weightsphysical.cns * 0.60);
            break;
          case 'Absent':
            cns_contribution = weightsphysical.cns - (weightsphysical.cns * 0.80);
            break;
          default:
            cns_contribution = 0;
        }
  
        return cns_contribution;
      }
  
      function calculate_malnutrition_score(score: string) {
        let malnutrition_contribution = 0;
  
        switch (score) {
          case 'Absent':
            malnutrition_contribution = weightsphysical.malnutrition;
            break;
          case 'Slight Malnutrition':
            malnutrition_contribution = weightsphysical.malnutrition - (weightsphysical.malnutrition * 0.20);
            break;
          case 'Mild Malnutrition':
            malnutrition_contribution = weightsphysical.malnutrition - (weightsphysical.malnutrition * 0.40);
            break;
          case 'Moderate Malnutrition':
            malnutrition_contribution = weightsphysical.malnutrition - (weightsphysical.malnutrition * 0.60);
            break;
          case 'Severe Malnutrition':
            malnutrition_contribution = weightsphysical.malnutrition - (weightsphysical.malnutrition * 0.80);
            break;
          default:
            malnutrition_contribution = 0;
        }
  
        return malnutrition_contribution;
      }
  
      function calculate_gi_score(score: string) {
        let gi_contribution = 0;
  
        switch (score) {
          case 'Normal':
            gi_contribution = weightsphysical.gi;
            break;
          case 'Mild Issues':
            gi_contribution = weightsphysical.gi - (weightsphysical.gi * 0.20);
            break;
          case 'Moderate Issues':
            gi_contribution = weightsphysical.gi - (weightsphysical.gi * 0.40);
            break;
          case 'Severe Issues':
            gi_contribution = weightsphysical.gi - (weightsphysical.gi * 0.60);
            break;
          case 'Absent':
            gi_contribution = weightsphysical.gi - (weightsphysical.gi * 0.80);
            break;
          default:
            gi_contribution = 0;
        }
  
        return gi_contribution;
      }
  
      // Calculate total physical health score
      total_physical_health_score += skin_score + swelling_score + head_neck_score + cns_score + malnutrition_score + gi_score;
  
      // Calculate final physical health score as a percentage
      let physical_health_score = total_physical_health_score * 100; 
  
      // Save the final score
      await AsyncStorage.setItem('Physical_Health_Score', physical_health_score.toFixed());
  
      console.log("Final Physical Health Score:", physical_health_score);
  
      //_________________________________MENTAL WELLNESS_________________________________
      // Define the type for the keys
      type category = 'alertness' | 'eyeContact' | 'generalBehavior';
  
      // List of words for sentiment analysis
      const positiveWords: Record<category, string[]> = {
        alertness: ['focused', 'attentive', 'alert', 'clear-headed', 'engaged', 'active', 'aware', 'sharp', 'energetic', 'bright', 'quick-witted', 'observant', 'vigilant', 'perceptive', 'astute', 'strong-minded'],
        eyeContact: ['sharp', 'direct', 'focused', 'steady', 'engaged', 'attentive', 'open', 'clear', 'sincere', 'firm', 'unwavering', 'expressive', 'authentic', 'intentional', 'committed', 'confident'],
        generalBehavior: ['cooperative', 'humble', 'friendly', 'respectful', 'well-mannered', 'polite', 'helpful', 'kind', 'warm', 'sociable', 'considerate', 'supportive', 'generous', 'caring', 'approachable', 'patient', 'benevolent']
      };
  
      const negativeWords: Record<category, string[]> = {
        alertness: ['distracted', 'unfocused', 'sleepy', 'tired', 'disengaged', 'inattentive', 'drowsy', 'absent-minded', 'foggy', 'sluggish', 'unclear', 'confused', 'lethargic', 'disoriented', 'mentally-absent'],
        eyeContact: ['avoidant', 'shifty', 'weak', 'vacant', 'evasive', 'blurry', 'unfocused', 'hesitant', 'nervous', 'unsteady', 'restless', 'uncomfortable', 'distant', 'uncertain', 'shifty-eyed'],
        generalBehavior: ['aggressive', 'rude', 'impolite', 'unfriendly', 'stubborn', 'selfish', 'disruptive', 'disrespectful', 'irritable', 'grumpy', 'uncooperative', 'moody', 'combative', 'hostile', 'self-centered', 'obnoxious']
      };
  
      const neutralWords: Record<category, string[]> = {
        alertness: ['neutral', 'okay', 'normal', 'fine', 'average', 'balanced', 'steady', 'routine', 'typical', 'consistent', 'adequate', 'sufficient', 'undisturbed'],
        eyeContact: ['normal', 'average', 'occasional', 'steady', 'brief', 'neutral', 'typical', 'distant', 'unremarkable', 'indifferent'],
        generalBehavior: ['neutral', 'calm', 'quiet', 'normal', 'stable', 'fine', 'polite', 'reserved', 'moderate', 'detached', 'unaffected', 'ordinary', 'predictable']
      };
  
      // Helper function for fuzzy matching
      const fuzzyMatch = (word: string, wordList: string[]): string | null => {
        return wordList.find(item => item.toLowerCase() === word.toLowerCase()) || null;
      };
  
      // Sentiment analysis function
      const getSentiment = (text: string, category: category): string => {
        const words = text.split(" ");
        for (let word of words) {
          if (fuzzyMatch(word, positiveWords[category])) return "Positive";
          if (fuzzyMatch(word, negativeWords[category])) return "Negative";
          if (fuzzyMatch(word, neutralWords[category])) return "Neutral";
        }
        return "Unclear";
      };
  
      // Final calculation for the Mental Wellness category
      const calculateMentalWellnessScore = (alertnessText: string, eyeContactText: string, generalBehaviorText: string): number => {
        const alertnessSentiment = getSentiment(alertnessText, "alertness");
        const eyeContactSentiment = getSentiment(eyeContactText, "eyeContact");
        const generalBehaviorSentiment = getSentiment(generalBehaviorText, "generalBehavior");
  
        // Logic for calculating the final score
        const sentiments = [alertnessSentiment, eyeContactSentiment, generalBehaviorSentiment];
        const positiveCount = sentiments.filter(sentiment => sentiment === "Positive").length;
        const negativeCount = sentiments.filter(sentiment => sentiment === "Negative").length;
        const neutralCount = sentiments.filter(sentiment => sentiment === "Neutral").length;
  
        // Assign score based on combinations of positive, negative, and neutral sentiments
        if (positiveCount === 3) return 100;
        if (negativeCount === 3) return 0;
        if (positiveCount === 2 && negativeCount === 1) return 70;
        if (positiveCount === 1 && negativeCount === 2) return 35;
        if (positiveCount === 2 && neutralCount === 1) return 85;
        if (negativeCount === 1 && neutralCount === 2) return 45;
        if (neutralCount === 3) return 50;
        return 0; // Default score for unclear results
      };
  
      // Example of using this logic for the Mental Wellness category
  
      const mentalWellnessScore = calculateMentalWellnessScore(formData['alertness'], formData['eyeContact'], formData['generalBehavior']);
  
      // Save the final mental wellness score (for example, using AsyncStorage)
      
  await AsyncStorage.setItem('Mental_Wellness_Score', mentalWellnessScore.toString());
  console.log("Final Mental Wellness Score:", mentalWellnessScore);

  try {
  let OverallScore = ((General_Health_Score + ENT_Score + Vision_score + Oral_score + physical_health_score + mentalWellnessScore) / 6).toFixed();
  let UserID = await AsyncStorage.getItem('UserID');
  
  const response = await fetch('http://192.168.0.102:5002/routes/auth/insertScores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      General_Health_Score,
      ENT_Score,
      Vision_score,
      Oral_score,
      physical_health_score,
      mentalWellnessScore,
      OverallScore,
      UserID,
    }),
  });

  const updateprofile = await fetch('http://192.168.0.102:5002/routes/auth/updateprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      age,
      gender,
      UserID,
    }),
  });
   await AsyncStorage.setItem('age', age.toString());
          await AsyncStorage.setItem('gender', gender.toString());

  const data = await response.json();
  console.log('DATA: ', data);

  if (response.ok) {
    // Update scores state (if using a global state management system like Context or Redux)
    alert(data.message);
    Alert.alert('Success', 'Scores added successfully');
    setCurrentCategory(0)
    setFormData({
      height: '',
      weight: '',
      bmi:'',
      bp: '',
      heartrate:'',
      temperature: '',
      earWax: 'Select',
      otitismedia:'Select',
      audiometry: 'Select',
      tonsils:'Select',
      nasalStructure: 'Select',
      color:'',
      myopiaL: 'Select',
      myopiaR: 'Select',
      hyperopiaL: 'Select',
      hyperopiaR: 'Select',
      squinteyes: 'Select',
      teethCondition: 'Select',
      oralHygiene: 'Select',
      dentalCavities: 'Select',
      discolor:'Select',
      skinCondition: 'Select',
      swelling:'Select',
      headneck:'Select',
      cnsCondition: 'Select',
      malnutrition: 'Select',
      gisystems:'Select',
      alertness: '',
      eyeContact: '',
      generalBehavior: '',
      gender: 'Select',
    })
    setAge("")
    setGender('')
    router.push('tabs/score');
  } else {
    alert(data.error || 'Failed to Add Scores');
  }                       
  
} catch (error) {
  Alert.alert('Error', 'An unexpected error occurred');
  console.error(error);
}};
    
    
    // Handle gender selection
    const handleGenderChange = (value: string) => {
      setGender(value)
      setShowGenderPicker(false); // Close the modal after selecting gender
    };
  
    const handleFieldPickerChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setShowFieldPicker(false);
    setCurrentPickerField(null);
  };
  
    // Toggle the gender picker visibility
    const toggleGenderPicker = () => {
      setShowGenderPicker(!showGenderPicker);
    };
  
    // Text color based on the selected gender
    const handleGenderTextColor = (gender: string) => {
      return gender !== 'default' ? 'black' : '#999';
    };
  
    // Return black when a value is selected, otherwise grey
    const handleSelectTextColor = (fieldKey: string) => {
      return formData[fieldKey] !== 'Select' ? 'black' : '#999';
    };
  
    const handleSelectOpacity = (fieldKey: string) => {
      return formData[fieldKey] !== 'Select' ? 1 : 0.5;
    };
  
  const toggleFieldPicker = (key: string) => {
    if (currentPickerField === key && showFieldPicker) {
      setShowFieldPicker(false);
      setCurrentPickerField(null);
    } else {
      setCurrentPickerField(key);
      setShowFieldPicker(true);
    }
  };
  
   
    return (
      // <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
              paddingHorizontal:17, // To prevent containers from going too wide
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleprofilelogo}>
              <Image
                source={require('../../assets/icons/triangle.png')} // Replace with profile picture path
                style={styles.profileImage}
              />
              </TouchableOpacity>
              <Text style={styles.profileName}>{username}</Text>
            </View>
  
            {/* Display Age and Gender Only for First Category */}
            {currentCategory === 0 && (
              <View style={styles.userInfo}>
                <View style={styles.ageGenderContainer}>
                  <TextInput
                    style={styles.ageInput}
                    placeholder="Age *:"
                    keyboardType="numeric"
                    onChangeText={(inputText) => setAge(inputText)}
                    value={age}
                  />
                  
                  <TouchableOpacity
                    style={styles.pickerContainer}
                    onPress={toggleGenderPicker}
                  >
                    <Text style={[
                            styles.pickerText,
                            { color: handleGenderTextColor(gender) }
                          ]} >
                            <Image
                    source={require('../../assets/icons/select.png')}
                    style={styles.selecticon}
                  />
                      {gender === 'default' ? 'Gender *:' : gender}
                      
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
  
            {/* Display Current Category */}
            <Text style={styles.categoryTitle}>
              Category : {categories[currentCategory].title}
            </Text>
  
            <View style={styles.statsContainer}>
              {categories[currentCategory].fields.map((field, index) => {
                if ('type' in field && field.type === 'select') {
                  return (
                    <View key={index} style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>{field.label}</Text>
                    
                      <TouchableOpacity onPress={() => toggleFieldPicker(field.key)}>
                        <Text
                          style={[
                            styles.selectText,
                            { color: handleSelectTextColor(field.key) },
                            // { opacity: handleSelectOpacity(field.key) },
                          ]}
                        >
                          
                          <Image
                    source={require('../../assets/icons/select.png')}
                    style={styles.selecticon1}
                  />
                          {formData[field.key] === 'Select'
                            ? field.placeholder
                            : formData[field.key]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return (
                    <View key={index} style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>{field.label}</Text>
                      <TextInput
                        style={styles.input}
                        value={formData[field.key]}
                        onChangeText={(text) =>
                          setFormData({ ...formData, [field.key]: text })
                        }
                        placeholder={field.placeholder}
                      />
                    </View>
                  );
                }
              })}
            </View>
  
            {/* Empty space to push buttons to the bottom */}
            <View style={{ flex: 1 }} />
  
            {/* Button Section */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleBack} style={styles.button}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
  
              {/* Show "Next" and "Skip" Button Except for Last Category */}
              {currentCategory < categories.length - 1 ? (
                <>
                  <TouchableOpacity onPress={handleSkip} style={styles.button}>
                    <Text style={styles.buttonText}>Skip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNext} style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // For Last Category, Show Overall Health Score Button
                <TouchableOpacity onPress={handleOverallScore} style={styles.calculatebutton}>
                  <Text style={styles.buttonText}>Calculate Health Score</Text>
                </TouchableOpacity>
              )}
            </View>
  
            {/* Display Modal for Picker */}
            {showGenderPicker && (
          <Modal transparent={true} visible={showGenderPicker}>
            <TouchableWithoutFeedback onPress={() => setShowGenderPicker(false)}>
              <View style={styles.modalBackground} />
            </TouchableWithoutFeedback>
  
            <View style={styles.pickerWrapper}>
              {/* Custom Options Container */}
              <View style={styles.optionsContainer}>
                {/* <TouchableOpacity
                  onPress={() => handleGenderChange('Gender *')}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>Gender *</Text>
                  </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => handleGenderChange('Male')}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderChange('Female')}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderChange('Other')}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
  
            {showFieldPicker && (
              <Modal transparent={true} visible={showFieldPicker}>
    {/* Dark semi-transparent background */}
    <TouchableWithoutFeedback onPress={() => setShowFieldPicker(false)}>
      <View style={styles.modalBackground} />
    </TouchableWithoutFeedback>
  
    {/* Picker Wrapper with options */}
    <View style={styles.pickerWrapper}>
      {/* Display options container */}
      <View style={styles.optionsContainer}>
        {categories[currentCategory].fields
          .find((field) => field.key === currentPickerField)
          ?.options?.map((option: string, idx: React.Key | null | undefined) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              onPress={() => handleFieldPickerChange(currentPickerField || '', option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  </Modal>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: RESPONSIVE_PADDING,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    paddingHorizontal: RESPONSIVE_PADDING,
    paddingBottom: height * 0.02, // 2% of screen height
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02, // 3% of screen height
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  profileName: {
    marginLeft: width * 0.03, // 3% of screen width
    fontSize: width*0.06,
    fontWeight: 'bold',
  },
  userInfo: {
    marginTop: height * 0.015, // 1% of screen height
  },
  ageGenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageInput: {
    borderWidth: 1,
    borderColor: 'black',
    padding: height * 0.012, // 1.2% of screen height
    borderRadius: 8,
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    padding: height * 0.012, // 1.2% of screen height
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: width*0.04,
    color:"white"
    // color: '#999',
    // opacity: 0.5,
  },
  selecticon: {
    width: width * 0.04, // Adjust icon size responsively
    height: width * 0.04,
    paddingTop:6,
  },
  categoryTitle: {
    fontSize: width*0.07,
    fontWeight: 'bold',
    marginTop: height * 0.02, // 2% of screen height
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: height * 0.01, // 2% of screen height
  },
  fieldContainer: {
    marginBottom: height * 0.02, // 2% of screen height
  },
  fieldLabel: {
    fontSize: width*0.04,
    fontWeight: '600',
    marginBottom: height * 0.01, // 1% of screen height
    
  },
  selecticon1:{
    width: width * 0.04, // Adjust icon size responsively
    height: width * 0.04,
    paddingTop:8,
  },
  input: {
    height: height * 0.058, // 5% of screen height
    borderWidth: 1,
    borderColor: 'grey',
    paddingLeft: width * 0.02, // 2% of screen width
    borderRadius: 5,
    fontSize:width*0.035,
  },
  selectText: {
    height: height * 0.05, // 4.5% of screen height
    // color: '#999',
    // opacity: 0.5,
    borderColor: 'grey',
    borderWidth: 1,
    paddingLeft: width * 0.02, // 2% of screen width
    borderRadius: 5,
    justifyContent: 'center',
    paddingTop:height*0.013,
    fontSize:width*0.035,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02, // 2% of screen height
    width: '100%',
    marginBottom: Platform.OS === 'android' ? height * 0.000001 : height * 0.015, // Slightly larger for Android
    paddingBottom: Platform.OS === 'android' ? height * 0.000005 : height * 0.03, // Responsive padding for both platforms

  },
  button: {
    paddingVertical: height * 0.012, // 1.2% of screen height
    backgroundColor: 'black',
    borderRadius: 5,
    width: BUTTON_WIDTH,
    marginBottom: 70
  },
  calculatebutton: {
    paddingVertical: height * 0.012, // 1.2% of screen height
    backgroundColor: 'black',
    borderRadius: 5,
    width: CALCULATE_BUTTON_WIDTH,
    marginBottom: 70
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  optionsContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '100%',
    height:"35%",
    justifyContent: 'center',

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
});
export default Calculate




// const General_Health_Score = localStorage.getItem('General_Health_Score')
// const ENT_Score = localStorage.getItem('ENT_Score')
// const Oral_score = localStorage.getItem('Oral_score')
// const Vision_score = localStorage.getItem('Vision_score')
// const physical_score = localStorage.getItem('physical_score')