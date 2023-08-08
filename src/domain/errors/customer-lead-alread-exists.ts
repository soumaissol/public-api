import { GenericError, Locale } from 'sms-api-commons';

class CustomerLeadAlreadExists extends GenericError {
  constructor(locale: Locale, customerId: string) {
    super(locale.translate('customer lead alread exists for customer %s', customerId), 'customer_lead_alread_exists');
  }
}

export default CustomerLeadAlreadExists;
