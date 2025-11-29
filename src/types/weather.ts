export interface WeatherData {
  name: string;
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
    sunrise: number;
    sunset: number;
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
  };
}

export interface CitySuggestion {
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
