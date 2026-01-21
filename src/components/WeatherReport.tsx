import { useState, useEffect } from 'react'
import axios from 'axios'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/WeatherReport.css'

interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
  pressure: number
  feelsLike: number
}

interface SavedWeather {
  [city: string]: WeatherData
}

interface LocationSuggestion {
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
  type: 'history' | 'api'
}

function WeatherReport() {
  const [savedWeathers, setSavedWeathers] = useLocalStorage<SavedWeather>('weatherHistory', {})
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [city, setCity] = useLocalStorage<string>('lastSearchedCity', '')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // Load weather from localStorage on mount
  useEffect(() => {
    if (city && savedWeathers[city]) {
      setWeather(savedWeathers[city])
      setSearchInput(city)
    }
  }, [city, savedWeathers])

  // Fetch live location suggestions from API
  const fetchLocationSuggestions = async (input: string) => {
    if (!input.trim() || input.length < 2) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`
      )

      if (response.data.results && response.data.results.length > 0) {
        const apiSuggestions: LocationSuggestion[] = response.data.results
          .slice(0, 8)
          .map((result: any) => ({
            name: result.name,
            country: result.country,
            admin1: result.admin1,
            latitude: result.latitude,
            longitude: result.longitude,
            type: 'api',
          }))

        // Combine with history suggestions
        const searchLower = input.toLowerCase()
        const historySuggestions: LocationSuggestion[] = Object.keys(savedWeathers)
          .filter((savedCity) => savedCity.toLowerCase().includes(searchLower))
          .slice(0, 3)
          .map((name) => ({
            name,
            type: 'history',
            latitude: 0,
            longitude: 0,
          }))

        // Merge and remove duplicates
        const merged = [
          ...historySuggestions,
          ...apiSuggestions.filter(
            (api) => !historySuggestions.some((hist) => hist.name === api.name)
          ),
        ]

        setSuggestions(merged)
      } else {
        setSuggestions([])
      }
    } catch (err) {
      console.error('Error fetching locations:', err)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)

    // Debounce API calls
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      fetchLocationSuggestions(value)
    }, 300)
    setDebounceTimer(timer)
  }

  const selectSuggestion = (selectedLocation: LocationSuggestion) => {
    setSearchInput(selectedLocation.name)
    setSuggestions([])
    fetchWeather(selectedLocation.name)
  }

  const fetchWeather = async (cityName: string) => {
    const nameToSearch = cityName || searchInput
    if (!nameToSearch.trim()) {
      setError('Please enter a city name.')
      return
    }

    setLoading(true)
    setError('')
    setSuggestions([])
    try {
      // Using Open-Meteo API (free, no API key needed)
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${nameToSearch}&count=1&language=en&format=json`
      )

      if (geoResponse.data.results.length === 0) {
        setError('City not found. Please try another city.')
        setLoading(false)
        return
      }

      const { latitude, longitude, name } = geoResponse.data.results[0]

      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
      )

      const current = weatherResponse.data.current
      const description = getWeatherDescription(current.weather_code)
      const icon = getWeatherIcon(current.weather_code)

      const weatherData: WeatherData = {
        city: name,
        temperature: Math.round(current.temperature_2m),
        description,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        icon,
        pressure: current.pressure_msl,
        feelsLike: Math.round(current.apparent_temperature),
      }
      
      setWeather(weatherData)
      
      // Save city and weather to localStorage
      setCity(name)
      setSavedWeathers({
        ...savedWeathers,
        [name]: weatherData,
      })
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
    }
    return descriptions[code] || 'Unknown'
  }

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return '☀️'
    if (code === 1 || code === 2) return '⛅'
    if (code === 3) return '☁️'
    if (code === 45 || code === 48) return '🌫️'
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️'
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '❄️'
    if (code >= 80 && code <= 82) return '⛈️'
    if (code >= 95 && code <= 99) return '⛈️'
    return '🌤️'
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  return (
    <div className="weather-container">
      <h2>Weather Report</h2>

      <div className="weather-search">
        <div className="weather-search-wrapper">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather('')}
            placeholder="🔍 Type city name..."
            className="weather-input"
            autoComplete="off"
          />
          {isSearching && <div className="search-loading">Loading...</div>}
          {suggestions.length > 0 && (
            <div className="weather-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.name}-${index}`}
                  className={`suggestion-item ${suggestion.type}`}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <span className="suggestion-icon">
                    {suggestion.type === 'history' ? '⭐' : '📍'}
                  </span>
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.name}</span>
                    {suggestion.country && (
                      <span className="suggestion-location">
                        {suggestion.admin1 ? `${suggestion.admin1}, ` : ''}
                        {suggestion.country}
                      </span>
                    )}
                  </div>
                  {suggestion.type === 'history' && savedWeathers[suggestion.name] && (
                    <span className="suggestion-temp">
                      {savedWeathers[suggestion.name].temperature}°C
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => fetchWeather('')} className="weather-btn">
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {error && <div className="weather-error">{error}</div>}

      {weather && (
        <div className="weather-card">
          <div className="weather-header">
            <div className="weather-icon-large">{weather.icon}</div>
            <div className="weather-info">
              <h3 className="weather-city">{weather.city}</h3>
              <p className="weather-description">{weather.description}</p>
            </div>
          </div>

          <div className="weather-temperature">
            <span className="temp-value">{weather.temperature}°C</span>
            <span className="feels-like">Feels like {weather.feelsLike}°C</span>
          </div>

          <div className="weather-details">
            <div className="weather-detail">
              <span className="detail-icon">💧</span>
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="weather-detail">
              <span className="detail-icon">💨</span>
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{weather.windSpeed} km/h</span>
            </div>
            <div className="weather-detail">
              <span className="detail-icon">🔽</span>
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{weather.pressure} hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherReport
