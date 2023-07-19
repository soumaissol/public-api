import axios from 'axios';

import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';
import PowerDistributorListing from '../../domain/entity/power-distributors-listing';
import Location from '../../domain/entity/location';
import PowerDistributor from '../../domain/entity/power-distributor';

import SolarEnergyGateway from './solar-energy-gateway';

export default class PortalSolarEnergyGateway implements SolarEnergyGateway {
  async getPowerDistributorListing(zip: string): Promise<PowerDistributorListing> {
    const result = await axios.get(
      `https://www.portalsolar.com.br/api/v1/simulations/power_distributors?postalcode=${zip}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    return new PowerDistributorListing(new Location(result.data.adress_name, result.data.city,
      result.data.state, result.data.UF), (result.data.power_distributors as any[])
        .map<PowerDistributor>((powerDistributor) => new PowerDistributor(
          parseInt(powerDistributor.id, 10), powerDistributor.name, parseFloat(powerDistributor.price),
        )));
  }

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
