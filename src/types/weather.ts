export interface WeatherData {
  name: string;
  coord: { lat: number; lon: number };
  timezone: number;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  sys: {
    country?: string;
    sunrise: number | null;
    sunset: number | null;
  };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      main: string;
    }>;
    dt_txt: string;
  }>;
  city: {
    name: string;
    timezone: number;
  };
}

export interface CitySuggestion {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export interface Theme {
  background: string;
  text: string;
  inputBg: string;
  inputBorder: string;
  buttonBg: string;
  buttonText: string;
  cardBg: string;
}
