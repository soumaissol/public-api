import GenericError from './generic-error';

export default class SalesAgentLeadAlreadExists extends GenericError {
  constructor(id: string) {
    super(`sales agent lead alread exists for ${id}`, 'sales_agent_lead_alread_exists');
  }
}
