import Customer from './customer';
import SalesAgent from './sales-agent';

class CustomerLead {
  constructor(
    readonly id: string,
    readonly customer: Customer,
    readonly salesAgent: SalesAgent,
  ) {}
}

export default CustomerLead;
