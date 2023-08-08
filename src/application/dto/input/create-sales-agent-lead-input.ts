import * as jf from 'joiful';
import { InvalidInput, safelyParseData } from 'sms-api-commons';

export default class CreateSalesAgentLeadInput {
  @jf.string().required().error(new InvalidInput('invalid phone', 'invalid_phone'))
  public phone: string;

  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.string().required().error(new InvalidInput('invalid full name', 'invalid_full_name'))
  public fullName: string;

  @jf.string().required().error(new InvalidInput('invalid occupation', 'invalid_occupation'))
  public occupation: string;

  @jf.string().required().error(new InvalidInput('invalid city and state', 'invalid_city_and_state'))
  public cityAndState: string;

  @jf.string().allow('', null).error(new InvalidInput('invalid license id', 'invalid_license_id'))
  public licenseId: string | null;

  @jf.string().allow('', null).error(new InvalidInput('invalid agency', 'invalid_agency'))
  public agency: string | null;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.phone = inputData.phone;
    this.email = inputData.email;
    this.fullName = inputData.fullName;
    this.occupation = inputData.occupation;
    this.cityAndState = inputData.cityAndState;
    this.licenseId = inputData.licenseId || null;
    this.agency = inputData.agency || null;
  }
}
