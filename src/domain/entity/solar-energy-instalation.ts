class SolarEnergyInstalation {
  private static readonly estimatedCostMultipliers = [
    { energyConsumption: 277.5, multiplier: 61 },
    { energyConsumption: 388.5, multiplier: 52 },
    { energyConsumption: 466.2, multiplier: 48 },
    { energyConsumption: 555.0, multiplier: 42 },
    { energyConsumption: 666.0, multiplier: 41 },
    { energyConsumption: 777.0, multiplier: 41 },
    { energyConsumption: 888.0, multiplier: 40 },
    { energyConsumption: 999.0, multiplier: 40 },
    { energyConsumption: 1110.0, multiplier: 39 },
    { energyConsumption: 1665.0, multiplier: 36 },
    { energyConsumption: 2220.0, multiplier: 36 },
    { energyConsumption: 2775.0, multiplier: 36 },
    { energyConsumption: 3330.0, multiplier: 35 },
    { energyConsumption: 3885.0, multiplier: 35 },
    { energyConsumption: 4440.0, multiplier: 35 },
    { energyConsumption: 4995.0, multiplier: 34 },
    { energyConsumption: 5550.0, multiplier: 34 },
    { energyConsumption: 11100.0, multiplier: 34 },
  ];

  static buildBasicSolarEnergyInstalation(energyConsumption: number): SolarEnergyInstalation {
    let multiplier =
      SolarEnergyInstalation.estimatedCostMultipliers[SolarEnergyInstalation.estimatedCostMultipliers.length - 1]
        .multiplier;
    for (const estimatedCostMultiplier of SolarEnergyInstalation.estimatedCostMultipliers) {
      if (estimatedCostMultiplier.energyConsumption >= energyConsumption) {
        multiplier = estimatedCostMultiplier.multiplier;
        break;
      }
    }
    return new SolarEnergyInstalation(energyConsumption, multiplier * energyConsumption, 12 * energyConsumption);
  }

  constructor(
    readonly lightBill: number,
    readonly estimatedCost: number,
    readonly annualSavings: number,
  ) {}
}

export default SolarEnergyInstalation;
