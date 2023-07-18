import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';

export default interface SolarEnergyGateway {
  calculateInstallationSimulation(zip: string, energyConsumption: number, powerDistributorId: number): Promise<SolarEnergyInstalation>;
}
