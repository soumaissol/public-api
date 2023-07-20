class SolarEnergyInstalation {
  private static readonly estimatedCostMultipliers = [
    { energyConsumption: 277.50, multiplier: 61 },
    { energyConsumption: 388.50, multiplier: 52 },
    { energyConsumption: 466.20, multiplier: 48 },
    { energyConsumption: 555.00, multiplier: 42 },
    { energyConsumption: 666.00, multiplier: 41 },
    { energyConsumption: 777.00, multiplier: 41 },
    { energyConsumption: 888.00, multiplier: 40 },
    { energyConsumption: 999.00, multiplier: 40 },
    { energyConsumption: 1110.00, multiplier: 39 },
    { energyConsumption: 1665.00, multiplier: 36 },
    { energyConsumption: 2220.00, multiplier: 36 },
    { energyConsumption: 2775.00, multiplier: 36 },
    { energyConsumption: 3330.00, multiplier: 35 },
    { energyConsumption: 3885.00, multiplier: 35 },
    { energyConsumption: 4440.00, multiplier: 35 },
    { energyConsumption: 4995.00, multiplier: 34 },
    { energyConsumption: 5550.00, multiplier: 34 },
    { energyConsumption: 11100.00, multiplier: 34 },
  ];

  static buildBasicSolarEnergyInstalation(energyConsumption: number): SolarEnergyInstalation {
    let multiplier = SolarEnergyInstalation.estimatedCostMultipliers[SolarEnergyInstalation.estimatedCostMultipliers.length - 1].multiplier;
    for (const estimatedCostMultiplier of SolarEnergyInstalation.estimatedCostMultipliers) {
      if (estimatedCostMultiplier.energyConsumption >= energyConsumption) {
        multiplier = estimatedCostMultiplier.multiplier;
        break;
      }
    }
    return new SolarEnergyInstalation(energyConsumption, multiplier * energyConsumption);
  }

  constructor(readonly lightBill: number, readonly estimatedCost: number) {
  }
}

export default SolarEnergyInstalation;

