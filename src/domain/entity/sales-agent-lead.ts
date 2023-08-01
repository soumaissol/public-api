import SalesAgent from './sales-agent';

export default class SalesAgentLead {
  constructor(
    readonly id: string,
    readonly salesAgent: SalesAgent,
  ) {}
}
