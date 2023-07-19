import PowerDistributorListing from '../../domain/entity/power-distributors-listing';
import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';

export default interface SolarEnergyGateway {
  calculateInstallationSimulation(zip: string, energyConsumption: number, powerDistributorId: number): Promise<SolarEnergyInstalation>;
  getPowerDistributorListing(zip: string): Promise<PowerDistributorListing>;
}
