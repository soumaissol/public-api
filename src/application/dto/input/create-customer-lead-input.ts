import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class CreateCustomerLeadInput {
  @jf.string().required().error(new InvalidInput('invalid phone', 'invalid_phone'))
  public phone: string;

  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.string().required().error(new InvalidInput('invalid full name', 'invalid_full_name'))
  public fullName: string;

  @jf.string().regex(/\d{8}/).required().error(new InvalidInput('invalid zip', 'invalid_zip'))
  public zip: string;

  @jf.number().min(0.0).required().error(new InvalidInput('invalid energyConsumption', 'invalid_energy_consumption'))
  public energyConsumption: number;

  @jf
    .string()
    .allow('', null)
    .error(new InvalidInput('invalid sales agent license id', 'invalid_sales_agent_license_id'))
  public salesAgentLicenseId: string | null;

  @jf.string().email().allow('', null).error(new InvalidInput('invalid sales agent email', 'invalid_sales_agent_email'))
  public salesAgentEmail: string | null;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.phone = inputData.phone;
    this.email = inputData.email;
    this.fullName = inputData.fullName;
    this.zip = inputData.zip;
    this.energyConsumption = inputData.energyConsumption;
    this.salesAgentLicenseId = inputData.salesAgentLicenseId || null;
    this.salesAgentEmail = inputData.salesAgentEmail || null;

    if (this.salesAgentLicenseId === null && this.salesAgentEmail === null) {
      throw new InvalidInput(
        'sales agent license id or email must be given to identify',
        'sales_agent_license_id_and_email_null',
      );
    }
  }
}
