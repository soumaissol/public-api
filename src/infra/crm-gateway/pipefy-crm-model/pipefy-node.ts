import type PipefyNodeField from './pipefy-node-field';

export default class PipefyNode {
  constructor(
    readonly id: string,
    readonly fields: PipefyNodeField[] = [],
  ) {}
}
