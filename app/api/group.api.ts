import axios from 'axios';
import baseUrl from './api';

export const fetchWeatherData = async () => {
  try {
    const configurationObject = {
      method: 'get',
      url: `${baseUrl}/api/weatherforecast`,
    };
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};