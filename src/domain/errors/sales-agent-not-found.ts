import Locale from '../../locale/locale';
import GenericError from './generic-error';

class SalesAgentNotFound extends GenericError {
  constructor(locale: Locale, id: string) {
    super(locale.translate('sales agent not found for id %s', id), 'sales_agent_not_found');
  }
}

export default SalesAgentNotFound;
