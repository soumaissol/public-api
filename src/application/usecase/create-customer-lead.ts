import Customer from '../../domain/entity/customer';
import CustomerLeadAlreadExists from '../../domain/errors/customer-lead-alread-exists';
import SalesAgentNotFound from '../../domain/errors/sales-agent-not-found';
import CrmGateway from '../../infra/crm-gateway/crm-gateway';
import { convertAndValidateInput } from '../dto/input/common-input';
import CreateCustomerLeadInput from '../dto/input/create-customer-lead-input';
import CreateCustomerLeadOutput from '../dto/output/create-customer-lead-output';
import Logger from '../logger/logger';

export default class CreateCustomerLead {
  constructor(readonly crmGateway: CrmGateway) {}

  async execute(input: any): Promise<CreateCustomerLeadOutput> {
    const logger = Logger.get();
    const validInput = convertAndValidateInput<CreateCustomerLeadInput>(input, new CreateCustomerLeadInput(input));

    const inputCustomer = new Customer(
      validInput.phone,
      validInput.email,
      validInput.fullName,
      validInput.zip,
      validInput.energyConsumption,
    );

    const salesAgent = await this.crmGateway.findSalesAgentBytLicenseId(validInput.salesAgentLicenseId);
    if (salesAgent === null) {
      throw new SalesAgentNotFound(validInput.salesAgentLicenseId);
    }

    let customer = await this.crmGateway.findCustomerByPhone(inputCustomer.getPhone());
    if (customer === null) {
      logger.info(`creating new customer for ${inputCustomer.getPhone()}`);
      customer = await this.crmGateway.createCustomer(inputCustomer, salesAgent);
    }

    let customerLead = await this.crmGateway.findCustomerLeadByCustomer(customer, salesAgent);
    if (customerLead != null) {
      logger.warn(`lead for customer ${customer.id}, already exists: ${customerLead.id}`);
      throw new CustomerLeadAlreadExists(customer.id);
    }

    customerLead = await this.crmGateway.createCustomerLead(customer, salesAgent);
    return new CreateCustomerLeadOutput(customerLead.id);
  }
}
