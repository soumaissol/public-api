import GenericError from './generic-error';

class SalesAgentNotFound extends GenericError {
  constructor(id: string) {
    super(`sales agent not found for id ${id}`, 'sales_agent_not_found');
  }
}

export default SalesAgentNotFound;
