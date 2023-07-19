import Location from '../../domain/entity/location';
import PowerDistributor from '../../domain/entity/power-distributor';
import PowerDistributorListing from '../../domain/entity/power-distributors-listing';
import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';

import SolarEnergyGateway from './solar-energy-gateway';

export default class FakeSolarEnergyGateway implements SolarEnergyGateway {
  getPowerDistributorListing(zip: string): Promise<PowerDistributorListing> {
    return Promise.resolve(new PowerDistributorListing(new Location('Rua Rubens Meireles', 'São Paulo', 'São Paulo', 'SP'),
      [
        new PowerDistributor(115, 'Cedrap', 0.8),
        new PowerDistributor(116, 'Cedri', 0.74),

      ]));
  }

  calculateInstallationSimulation(): Promise<SolarEnergyInstalation> {
    return Promise.resolve(new SolarEnergyInstalation(200.0, 16741.28006));
  }
}
