import * as jf from 'joiful';

import InvalidInput from '../../errors/invalid-input';
import { safelyParseData } from './common-input';

export default class CreateSalesAgentLeadInput {
  @jf.string().required().error(new InvalidInput('invalid phone', 'invalid_phone'))
  public phone: string;

  @jf.string().email().required().error(new InvalidInput('invalid email', 'invalid_email'))
  public email: string;

  @jf.string().required().error(new InvalidInput('invalid full name', 'invalid_full_name'))
  public fullName: string;

  @jf.string().allow('', null).error(new InvalidInput('invalid license id', 'invalid_license_id'))
  public licenseId: string | null;

  @jf
    .array()
    .required()
    .items((joi) => joi.string().error(new InvalidInput('invalid agency id', 'invalid_agency_id')))
    .error(new InvalidInput('invalid agency ids', 'invalid_agency_ids'))
  public agencyIds: string[];

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.phone = inputData.phone;
    this.email = inputData.email;
    this.fullName = inputData.fullName;
    this.licenseId = inputData.licenseId || null;
    this.agencyIds = inputData.agencyIds;
  }
}
