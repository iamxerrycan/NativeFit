import React, { useState, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  Image,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function Wether() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDay, setIsday] = useState(false);

  const fetchWeatherData = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://rest-api-backend-lad4.onrender.com/weather?q=${searchQuery}`
      );
      const data = await response.json();

      if (response.ok) {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;
        setWeatherData(data);
        setIsday(currentTime >= sunrise && currentTime < sunset);
      } else {
        setError(`Location not found: ${data.message}`);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
      setSearchQuery('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🌤️ Minimalist Weather</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter city name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchWeatherData}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {weatherData ? (
        <View style={styles.weatherContainer}>
          <View style={styles.imgtop}>
            <Image
              source={
                isDay
                  ? require('../assets/images/sun.png')
                  : require('../assets/images/moon.png')
              }
              style={styles.weatherIcon}
            />
          </View>
          <View style={styles.containerweather}>
            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.value}>City: {weatherData.name}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.value}>
                  Temperature: {weatherData.main.temp}°C
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.value}>
                  Mood: {weatherData.weather[0].description}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.value}>
                  Humidity: {weatherData.main.humidity}%
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.value}>
                  Wind Speed: {weatherData.wind.speed} m/s
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.value}>
                  Pressure: {weatherData.main.pressure} hPa
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noResultsText}>Search For Location</Text>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#000000" style={styles.indi} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  searchButton: {
    backgroundColor: 'black',
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginTop: 100,
    gap: 15,
    width: '100%',
  },
  value: {
    fontSize: 15,
    color: '#f5f5f5',
    fontStyle: 'italic',
    fontWeight: '500',
    padding: 5,
    fontFamily: 'sans-serif',
  },
  errorText: {
    color: 'red',
    margin: 10,
    textAlign: 'center',
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    backgroundColor: 'black',
    flex: 1,
    height: 100,
    margin: 3,
    borderRadius: 10,
    justifyContent: 'center',
  },
  imgtop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indi: {
    marginTop: 20,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: '80%',
    color: 'gray',
  },
});
