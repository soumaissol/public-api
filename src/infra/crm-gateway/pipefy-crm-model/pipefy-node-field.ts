import PipefyField from './pipefy-field';

export default class PipefyNodeField {
  constructor(
    readonly value: string,
    readonly array_value: string[],
    readonly field: PipefyField,
  ) {}
}
