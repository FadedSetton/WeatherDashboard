import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  date: string;
  icon: string;
  alt: string;
  temp: number;
  wind: number;
  humidity: number;
  constructor(date: string, icon: string, alt: string, temp: number, wind: number, humidity: number) {
    this.date = date;
    this.icon = icon;
    this.alt = alt;
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  
}}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
  private geoURL = 'http://api.openweathermap.org/geo/1.0/direct';
  private apiKey = process.env.OPENWEATHER_API_KEY;
  //private cityName = '';

  private async fetchLocationData(query: string) {
    const url = `${this.geoURL}?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data[0];
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  private buildWeatherQuery(coords: Coordinates): string {
    return `${this.baseURL}?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchWeatherData(coords: Coordinates) {
    const url = this.buildWeatherQuery(coords);
    const response = await axios.get(url);
    return response.data;
  }

  private parseCurrentWeather(response: any): Weather {
    const { dt_txt, weather, main, wind } = response;
    return {
      date: dt_txt,
      icon: `https://openweathermap.org/img/wn/${weather[0].icon}.png`,
      alt: weather[0].description,
      temp: main.temp,
      wind: wind.speed,
      humidity: main.humidity,
    };
  }

  private buildForecastArray(weatherList: any[]): Weather[] {
    const dailyForecast: Weather[] = [];

    // Sample every 8th item (roughly 24 hours)
    for (let i = 0; i < weatherList.length; i += 8) {
      const parsed = this.parseCurrentWeather(weatherList[i]);
      dailyForecast.push(parsed);
    }

    return dailyForecast;
  }

  async getWeatherForCity(city: string) {
    //this.cityName = city;

    const locationData = await this.fetchLocationData(city);
    const coords = this.destructureLocationData(locationData);
    const forecastData = await this.fetchWeatherData(coords);

    const forecast = this.buildForecastArray(forecastData.list);

    return {
      coords,
      forecast,
    };
  }
}

export default new WeatherService();
