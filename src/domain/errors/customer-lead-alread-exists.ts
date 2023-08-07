import Locale from '../../locale/locale';
import GenericError from './generic-error';

class CustomerLeadAlreadExists extends GenericError {
  constructor(locale: Locale, customerId: string) {
    super(locale.translate('customer lead alread exists for customer %s', customerId), 'customer_lead_alread_exists');
  }
}

export default CustomerLeadAlreadExists;
