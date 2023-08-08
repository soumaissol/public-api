import type { Locale } from 'sms-api-commons';
import { GenericError } from 'sms-api-commons';

class SalesAgentNotFound extends GenericError {
  constructor(message: string) {
    super(message, 'sales_agent_not_found');
  }

  static byLicenseId(locale: Locale, licenseId: string): SalesAgentNotFound {
    return new SalesAgentNotFound(locale.translate('sales agent not found for license id %s', licenseId));
  }

  static byEmail(locale: Locale, email: string): SalesAgentNotFound {
    return new SalesAgentNotFound(locale.translate('sales agent not found for email %s', email));
  }
}

export default SalesAgentNotFound;
