import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';

import SolarEnergyGateway from './solar-energy-gateway';

export default class FakeSolarEnergyGateway implements SolarEnergyGateway {
  calculateInstallationSimulation(): Promise<SolarEnergyInstalation> {
    return Promise.resolve(new SolarEnergyInstalation(200.0, 16741.28006));
  }
}
