import axios from 'axios';
import HttpStatus from 'http-status-codes';

import Location from '../../domain/entity/location';
import PowerDistributor from '../../domain/entity/power-distributor';
import PowerDistributorListing from '../../domain/entity/power-distributors-listing';
import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';
import type SolarEnergyGateway from './solar-energy-gateway';

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

    return new PowerDistributorListing(
      new Location(result.data.adress_name, result.data.city, result.data.state, result.data.UF),
      (result.data.power_distributors as any[]).map<PowerDistributor>(
        (powerDistributor) =>
          new PowerDistributor(
            parseInt(powerDistributor.id, 10),
            powerDistributor.name,
            parseFloat(powerDistributor.price),
          ),
      ),
    );
  }

  async calculateInstallationSimulation(
    zip: string,
    energyConsumption: number,
    powerDistributorId: number,
  ): Promise<SolarEnergyInstalation> {
    const result = await axios.post(
      'https://www.portalsolar.com.br/api/v1/simulations/calculate',
      {
        simulation: {
          postalcode: zip,
          light_bill: energyConsumption,
          power_distributor_id: powerDistributorId,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    if (result.status !== HttpStatus.OK) {
      throw new Error(`response with error ${result.status}: ${result.data.message}`);
    }
    if (result.data.light_bill === undefined || result.data.estimated_cost === undefined) {
      throw new Error(`no data returned: ${result.data.message}`);
    }

    return new SolarEnergyInstalation(parseFloat(result.data.light_bill), parseFloat(result.data.estimated_cost));
  }
}
