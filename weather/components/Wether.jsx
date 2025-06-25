import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  Image,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function Wether() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDay, setIsday] = useState(false); // Set default to false

  const fetchWeatherData = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    try {
      const apiKey = "4cdd5dee4b21790322c9993b89fb25d1";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}&units=metric`
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
          setError(false);
        }, 2000);
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setError(null);
  }, []);

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
        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchWeatherData}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {weatherData ? (
        <View style={styles.weatherContainer}>
          <View style={styles.imgtop}>
            <Image
              source={isDay ? require("../assets/images/sun.png") : require("../assets/images/moon.png")}
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

      {loading && <ActivityIndicator size="large" color="#000000" style={styles.indi} />}
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    padding: 20,
    width: "auto",
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
  },
  containerweather: {
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  searchButton: {
    backgroundColor: "black",
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  weatherContainer: {
    marginTop: 100,
    gap: 15,
    width: "100%",
    padding: 20,
  },
  value: {
    fontSize: 20,
    color: "#f5f5f5",
    fontStyle: "italic",
    fontWeight: "600",
    letterSpacing: 0.5,
    padding: 5,
    fontFamily: "sans-serif",
    lineHeight: 20,
  },
  errorText: {
    color: "red",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: 10,
    display: "flex",
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  header: {
    justifyContent: "center",
    verticalAlign: "middle",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: "35%",
    width: "100%",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  box: {
    backgroundColor: "black",
    flex: 1,
    width: 200,
    height: 100,
    margin: 3,
    borderRadius: 10,
  },
  imgtop: {
    justifyContent: "center",
    alignItems: "center",
  },
  indi: {
    marginTop: 20, // Adjust as needed
  },
  noResultsText: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "80%",
  },
});
