import type { Locale } from 'sms-api-commons';
import { convertAndValidateInput, Logger } from 'sms-api-commons';

import SolarEnergyGateway from '../../infra/solar-energy-gateway/solar-energy-gateway';
import GetPowerDistributorsInput from '../dto/input/get-power-distributors-input';
import { GetPowerDistributorsOutput, PowerDistributorOutput } from '../dto/output/get-power-distributors-output';

export default class GetPowerDistributors {
  constructor(readonly solarEnergyGateway: SolarEnergyGateway) {}

  async execute(_: Locale, input: any): Promise<GetPowerDistributorsOutput | null> {
    const logger = Logger.get();
    const validInput = convertAndValidateInput<GetPowerDistributorsInput>(input, new GetPowerDistributorsInput(input));

    try {
      const powerDistributorListing = await this.solarEnergyGateway.getPowerDistributorListing(validInput.zip);
      return new GetPowerDistributorsOutput(
        powerDistributorListing.location.addressName,
        powerDistributorListing.location.city,
        powerDistributorListing.location.state,
        powerDistributorListing.location.sa,
        powerDistributorListing.powerDistributors.map<PowerDistributorOutput>(
          (powerDistributor) =>
            new PowerDistributorOutput(powerDistributor.id, powerDistributor.name, powerDistributor.price),
        ),
      );
    } catch (err: any) {
      logger.warn(`error on solarEnergyGateway: ${err.message}`);
      return null;
    }
  }
}
