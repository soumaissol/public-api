import GenericError from './generic-error';

class InvalidPhone extends GenericError {
  constructor() {
    super('phone is invalid', 'phone_is_invalid', true);
  }
}

export default InvalidPhone;
