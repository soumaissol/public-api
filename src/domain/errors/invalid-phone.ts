import { GenericError } from 'sms-api-commons';

class InvalidPhone extends GenericError {
  constructor() {
    super('phone is invalid', 'phone_is_invalid', true);
  }
}

export default InvalidPhone;
