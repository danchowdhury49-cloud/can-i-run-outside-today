import type { RegionSummary } from "./weather-types";

export type AdviceLabel = "Great" | "OK" | "Caution" | "Avoid";

export type RunAdvice = {
  score: number; // 0-100
  label: AdviceLabel;
  reasons: string[];
  clothing: string[];
  shoes: string[];
  fuelHydration: string[];
  vibeLine: string;
};

export type ConditionLike = {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  precipitationProbability: number;
  windspeed: number;
  windgusts: number;
};

export function scoreConditions(condition: ConditionLike): number {
  let score = 100;

  // Precipitation probability
  if (condition.precipitationProbability > 70) score -= 20;
  else if (condition.precipitationProbability > 40) score -= 10;
  else if (condition.precipitationProbability > 20) score -= 5;

  // Precipitation amount (mm)
  if (condition.precipitation > 5) score -= 25;
  else if (condition.precipitation > 2) score -= 15;
  else if (condition.precipitation > 0.5) score -= 7;

  // Wind gusts (km/h)
  if (condition.windgusts > 60) score -= 30;
  else if (condition.windgusts > 45) score -= 20;
  else if (condition.windgusts > 30) score -= 10;

  // Temperature / apparent temperature
  const feels = condition.apparentTemperature;
  if (feels < -2) score -= 25;
  else if (feels < 2) score -= 15;
  else if (feels < 5) score -= 8;

  if (feels > 24) score -= 20;
  else if (feels > 20) score -= 10;
  else if (feels > 18) score -= 5;

  // Mild bonus for really nice range
  if (feels >= 8 && feels <= 16 && condition.precipitation < 0.5 && condition.precipitationProbability < 40 && condition.windgusts < 35) {
    score += 5;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return Math.round(score);
}

export function labelForScore(score: number): AdviceLabel {
  if (score >= 80) return "Great";
  if (score >= 60) return "OK";
  if (score >= 40) return "Caution";
  return "Avoid";
}

export function buildAdvice(summary: RegionSummary): RunAdvice {
  const condition: ConditionLike = {
    temperature: summary.temperatureMean,
    apparentTemperature: summary.apparentTemperatureMean,
    precipitation: summary.precipitationMean,
    precipitationProbability: summary.precipitationProbabilityMean,
    windspeed: summary.windspeedMean,
    windgusts: summary.windgustsMean
  };

  const score = scoreConditions(condition);
  const label = labelForScore(score);
  const reasons: string[] = [];
  const clothing: string[] = [];
  const shoes: string[] = [];
  const fuelHydration: string[] = [];

  const feels = condition.apparentTemperature;

  // Reasons
  if (condition.precipitationProbability > 50) {
    reasons.push("High chance of getting rained on.");
  } else if (condition.precipitationProbability > 20) {
    reasons.push("Some chance of showers, but nothing dramatic.");
  } else {
    reasons.push("Low rain risk — sky is mostly on your side.");
  }

  if (condition.windgusts > 60) {
    reasons.push("Very strong gusts — your hair and pacing will suffer.");
  } else if (condition.windgusts > 45) {
    reasons.push("Gusty conditions; expect some unexpected sideways strides.");
  } else if (condition.windgusts > 30) {
    reasons.push("Noticeable breeze that will spice up your intervals.");
  } else {
    reasons.push("Winds are manageable — aero socks optional.");
  }

  if (feels < 2) {
    reasons.push("Feels properly cold; warm-up and layers matter.");
  } else if (feels < 8) {
    reasons.push("Cool but runnable with the right kit.");
  } else if (feels > 22) {
    reasons.push("Quite warm; pace expectations and hydration accordingly.");
  } else {
    reasons.push("Comfortable temperature for most run types.");
  }

  // Clothing
  if (feels < 2) {
    clothing.push("Thermal long-sleeve and tights.");
    clothing.push("Gloves and a light hat or headband.");
    clothing.push("Consider a windproof shell for the first 10 minutes.");
  } else if (feels < 8) {
    clothing.push("Light long-sleeve or thin mid-layer.");
    clothing.push("Shorts or light tights depending on your cold tolerance.");
  } else if (feels < 16) {
    clothing.push("T-shirt and shorts sweet spot conditions.");
    clothing.push("Light gilet if you run cold at the start.");
  } else {
    clothing.push("Vest or light tee and breathable shorts.");
    clothing.push("Avoid heavy layers; you will cook by kilometre three.");
  }

  if (condition.precipitation > 0.5 || condition.precipitationProbability > 50) {
    clothing.push("Water-resistant shell recommended for showers.");
  }

  if (condition.windgusts > 35) {
    clothing.push("Wind-resistant outer layer if you’ll be exposed.");
  }

  // Shoes
  if (condition.precipitation > 2) {
    shoes.push("Grippy shoes for wet pavements and potential puddles.");
  } else if (condition.precipitation > 0.5) {
    shoes.push("Everyday trainers with decent wet traction.");
  } else {
    shoes.push("Your favourite daily trainers will be happy.");
  }

  if (condition.precipitation === 0 && condition.windspeed < 10) {
    shoes.push("Feel free to bring the tempo or race shoes if planned.");
  } else {
    shoes.push("Save the shiny race shoes unless it’s a key session.");
  }

  // Fuel / hydration
  if (feels > 18) {
    fuelHydration.push("Take water or electrolytes for anything over 45 minutes.");
  } else {
    fuelHydration.push("Sip some water beforehand; bottle optional for easy runs.");
  }

  if (score < 50) {
    fuelHydration.push("If you go out, treat it as an easy, low-expectation day.");
  }

  // Vibe line
  let vibeLine = "Solid conditions: excuses are in short supply.";
  if (score >= 80) {
    vibeLine = "Prime running weather — your watch is already proud of you.";
  } else if (score >= 60) {
    vibeLine = "Decent enough: not perfect, but neither are most race days.";
  } else if (score >= 40) {
    vibeLine = "Spicy weather: character-building miles await.";
  } else {
    vibeLine = "So grim it almost counts as cross-training just to step outside.";
  }

  return {
    score,
    label,
    reasons,
    clothing,
    shoes,
    fuelHydration,
    vibeLine
  };
}

