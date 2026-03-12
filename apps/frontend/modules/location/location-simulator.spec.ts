import {
  formatCoordinatesToLocation,
  generateBrazilCoordinates,
} from '@/modules/location/location-simulator';

describe('location-simulator', () => {
  it('should generate coordinates inside Brazil geographic limits', () => {
    for (let i: number = 0; i < 100; i += 1) {
      const actualCoordinates = generateBrazilCoordinates();
      expect(actualCoordinates.latitude).toBeGreaterThanOrEqual(-33.75);
      expect(actualCoordinates.latitude).toBeLessThanOrEqual(5.27);
      expect(actualCoordinates.longitude).toBeGreaterThanOrEqual(-73.99);
      expect(actualCoordinates.longitude).toBeLessThanOrEqual(-34.79);
    }
  });
  it('should format latitude and longitude as location string', () => {
    const inputCoordinates = {
      latitude: -23.55052,
      longitude: -46.63331,
    };
    const actualLocation = formatCoordinatesToLocation(inputCoordinates);
    expect(actualLocation).toBe('Lat -23.55052, Long -46.63331');
  });
});
