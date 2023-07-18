import axios from 'axios';

import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';

import SolarEnergyGateway from './solar-energy-gateway';

export default class PortalSolarEnergyGateway implements SolarEnergyGateway {
  async calculateInstallationSimulation(zip: string, energyConsumption: number, powerDistributorId: number): Promise<SolarEnergyInstalation> {
    const result = await axios.post(
      'https://www.portalsolar.com.br/api/v1/simulations/calculate',
      {
        simulation: {
          postalcode: zip,
          light_bill: energyConsumption, // eslint-disable-line @typescript-eslint/naming-convention
          power_distributor_id: powerDistributorId, // eslint-disable-line @typescript-eslint/naming-convention
        },
      },
      {
        headers: {
          'Content-Type': 'application/json', // eslint-disable-line @typescript-eslint/naming-convention
          Accept: 'application/json',
        },
      },
    );

    return new SolarEnergyInstalation(parseFloat(result.data.light_bill),
      parseFloat(result.data.estimated_cost));
  }
}
