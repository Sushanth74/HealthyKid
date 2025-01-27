import React from 'react';
import { Text, View, Image, ImageSourcePropType, Dimensions, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import the hook inside
import { useWindowDimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define the type for the TabIcon props
type TabIconProps = {
  icon: ImageSourcePropType; // Type for icon (Image source type)
  color: string; // Type for color (string)
  name: string; // Type for name (string)
  focused: boolean; // Type for focused (boolean)
};

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: width * 0.1, // Adjust size based on screen width
          height: height * 0.05, // Adjust size based on screen height
          tintColor: color,
        }}
      />
      <Text
        style={{
          fontSize: width * 0.045, // Responsive font size
          fontWeight: focused ? '600' : '400',
          color: color,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function _layout  () {
  const insets = useSafeAreaInsets(); // Call the hook inside the functional component

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFC107',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: 'black',
            borderTopWidth: 1,
            borderTopColor: 'black',
            width: '100%',
            height: Math.min(70, height * 0.08) + insets.bottom, // Responsive height with safe area padding
            flexDirection: 'row',
            position: 'absolute',
            paddingBottom: insets.bottom, // Safe area padding
            elevation: 5, // Shadow for Android
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            
          },
          tabBarIconStyle: {
            marginTop: 10,
            marginBottom: 5,
            alignSelf: 'center',
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} focused={focused} name="" />
            ),
          }}
        />
        <Tabs.Screen
          name="calculate"
          options={{
            title: 'Calculate',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.calculate} color={color} focused={focused} name="" />
            ),
          }}
        />
        <Tabs.Screen
          name="score"
          options={{
            title: 'Score',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.score} color={color} focused={focused} name="" />
            ),
          }}
        />
        <Tabs.Screen
          name="dist"
          options={{
            title: 'Distribution',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.distribution}
                color={color}
                focused={focused}
                name=""
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} focused={focused} name="" />
            ),
          }}
        />
      </Tabs>
    </>
  );
};


