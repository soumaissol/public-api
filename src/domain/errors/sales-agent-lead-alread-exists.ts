import Locale from '../../locale/locale';
import GenericError from './generic-error';

export default class SalesAgentLeadAlreadExists extends GenericError {
  constructor(locale: Locale, id: string) {
    super(locale.translate('sales agent lead alread exists for %s', id), 'sales_agent_lead_alread_exists');
  }
}
