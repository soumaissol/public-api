import GenericError from './generic-error';

export default class SalesAgentLeadAlreadExists extends GenericError {
  constructor(licenseId: string) {
    super(`sales agent lead alread exists for customer ${licenseId}`, 'sales_agent_lead_alread_exists');
  }
}
