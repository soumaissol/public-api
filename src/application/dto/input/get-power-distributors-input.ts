import * as jf from 'joiful';

import InvalidInput from '../../errors/invalid-input';

import { safelyParseData } from './common-input';

export default class GetPowerDistributorsInput {
  @jf.string().regex(/\d{8}/).required()
    .error(new InvalidInput('invalid zip', 'invalid_zip'))
  public zip: string;

  constructor(input: any) {
    const inputData = safelyParseData(input);

    this.zip = inputData.zip;
  }
}
