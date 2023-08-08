import { GenericError } from 'sms-api-commons';

class GenericCrmError extends GenericError {
  constructor(errorMessage: string) {
    super(`generic error on crm: ${errorMessage}`, 'generic_crm_rrror');
  }
}

export default GenericCrmError;
