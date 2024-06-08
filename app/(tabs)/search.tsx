import axios from 'axios';
import { useEffect, useState } from 'react';
import useWeatherData from '../hooks/useGroup';
import { View, Text, Button, StyleSheet, TextInput, Pressable, Image, ActivityIndicator  } from 'react-native';

const SearchScreen = ()  => {
  const 
    weatherData
   = useWeatherData();
  
  return (
      <>
        <View>
          
        </View>
      </>
)};

export default SearchScreen;

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  });
  