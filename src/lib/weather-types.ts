import type { SamplePoint } from "./regions";

export type PointHourly = {
  time: string[]; // ISO strings
  temperature: number[];
  apparentTemperature: number[];
  precipitation: number[];
  precipitationProbability: number[];
  windspeed: number[];
  windgusts: number[];
};

export type PointSnapshot = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  precipitationProbability: number;
  windspeed: number;
  windgusts: number;
};

export type PointWeather = {
  point: SamplePoint;
  hourly: PointHourly;
  selected: PointSnapshot;
  selectedIndex: number;
  score: number;
};

export type RegionSummary = {
  regionSlug: string;
  hourOffset: number;
  time: string;
  temperatureMean: number;
  temperatureMin: number;
  temperatureMax: number;
  apparentTemperatureMean: number;
  precipitationMean: number;
  precipitationProbabilityMean: number;
  windspeedMean: number;
  windgustsMean: number;
};

export type BestWindow = {
  startOffset: number;
  endOffset: number;
  averageScore: number;
};

export type RegionWeatherResponse = {
  points: PointWeather[];
  summary: RegionSummary;
  bestWindow: BestWindow | null;
};

