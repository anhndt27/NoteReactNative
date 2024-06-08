import { useEffect, useState } from "react";
import { fetchWeatherData } from "../api/group.api";

const useWeatherData = () => {
    const [weatherData, setWeatherData] = useState([]);
  
    useEffect(() => {
      // const fetchData = async () => {
      //   try {
      //     const data = await fetchWeatherData();
      //     setWeatherData(data);
      //   } catch (error) {
      //     console.error('Error fetching weather data:', error);
      //   }
      // };
      // fetchData();
    }, []);
  
    return weatherData;
  };
  
  export default useWeatherData;