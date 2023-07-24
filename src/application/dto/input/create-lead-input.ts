import * as jf from 'joiful';

import InvalidInput from '../../errors/invalid-input';

import { safelyParseData } from './common-input';

export default class CreateLeadInput {
  @jf.string().required().error(new InvalidInput('invalid phone', 'invalid_phone'))
  public phone: string;

  @jf.string().email().required()
    .error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.string().required().error(new InvalidInput('invalid full name', 'invalid_full_name'))
  public fullName: string;

  @jf.string().regex(/\d{8}/).required()
    .error(new InvalidInput('invalid zip', 'invalid_zip'))
  public zip: string;

  @jf.number().min(0.0).required()
    .error(new InvalidInput('invalid energyConsumption', 'invalid_energy_consumption'))
  public energyConsumption: number;

  @jf.string().required().error(new InvalidInput('invalid sales agent license id',
    'invalid_sales_agent_license_id'))
  public salesAgentLicenseId: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.phone = inputData.phone;
    this.email = inputData.email;
    this.fullName = inputData.fullName;
    this.zip = inputData.zip;
    this.energyConsumption = inputData.energyConsumption;
    this.salesAgentLicenseId = inputData.salesAgentLicenseId;

  }
}
