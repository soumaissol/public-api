import GenericError from './generic-error';

class CustomerLeadAlreadExists extends GenericError {
  constructor(customerId: string | null) {
    super(`customer lead alread exists for customer ${customerId}`, 'customer_lead_alread_exists');
  }
}

export default CustomerLeadAlreadExists;
