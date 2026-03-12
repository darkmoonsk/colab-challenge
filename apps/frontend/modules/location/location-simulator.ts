interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

interface LocationFormattingInput {
  readonly latitude: number;
  readonly longitude: number;
}

const BRAZIL_GEO_LIMITS = {
  minLatitude: -33.75,
  maxLatitude: 5.27,
  minLongitude: -73.99,
  maxLongitude: -34.79,
} as const;

function roundCoordinate(value: number): number {
  return Number(value.toFixed(5));
}

function generateRandomInRange(minValue: number, maxValue: number): number {
  return Math.random() * (maxValue - minValue) + minValue;
}

export function generateBrazilCoordinates(): Coordinates {
  const latitude: number = roundCoordinate(
    generateRandomInRange(
      BRAZIL_GEO_LIMITS.minLatitude,
      BRAZIL_GEO_LIMITS.maxLatitude,
    ),
  );
  const longitude: number = roundCoordinate(
    generateRandomInRange(
      BRAZIL_GEO_LIMITS.minLongitude,
      BRAZIL_GEO_LIMITS.maxLongitude,
    ),
  );
  return { latitude, longitude };
}

export function formatCoordinatesToLocation(
  input: LocationFormattingInput,
): string {
  return `Lat ${input.latitude}, Long ${input.longitude}`;
}
