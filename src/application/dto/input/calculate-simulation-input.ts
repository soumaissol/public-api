import * as jf from 'joiful';

import InvalidInput from '../../errors/invalid-input';
import { safelyParseData } from './common-input';

export default class CalulateSimulationInput {
  @jf.number().required().error(new InvalidInput('invalid powerDistributorId', 'invalid_power_distributor_id'))
  public powerDistributorId: number;

  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.number().min(0.0).required().error(new InvalidInput('invalid energyConsumption', 'invalid_energy_consumption'))
  public energyConsumption: number;

  @jf.string().regex(/\d{8}/).required().error(new InvalidInput('invalid zip', 'invalid_zip'))
  public zip: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.powerDistributorId = inputData.powerDistributorId;
    this.email = inputData.email;
    this.energyConsumption = inputData.energyConsumption;
    this.zip = inputData.zip;
  }
}
