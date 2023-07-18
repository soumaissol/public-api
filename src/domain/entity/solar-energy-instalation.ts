class SolarEnergyInstalation {
  static buildBasicSolarEnergyInstalation(): SolarEnergyInstalation {
    return new SolarEnergyInstalation(400.0, 27000.0);
  }

  constructor(readonly lightBill: number, readonly estimatedCost: number) {
  }
}

export default SolarEnergyInstalation;

