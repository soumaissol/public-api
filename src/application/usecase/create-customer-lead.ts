import type { Locale } from 'sms-api-commons';
import { convertAndValidateInput, Logger } from 'sms-api-commons';

import Customer from '../../domain/entity/customer';
import CustomerLeadAlreadExists from '../../domain/errors/customer-lead-alread-exists';
import SalesAgentNotFound from '../../domain/errors/sales-agent-not-found';
import CrmGateway from '../../infra/crm-gateway/crm-gateway';
import CreateCustomerLeadInput from '../dto/input/create-customer-lead-input';
import CreateCustomerLeadOutput from '../dto/output/create-customer-lead-output';

export default class CreateCustomerLead {
  constructor(readonly crmGateway: CrmGateway) {}

  async execute(locale: Locale, input: any): Promise<CreateCustomerLeadOutput> {
    const logger = Logger.get();
    const validInput = convertAndValidateInput<CreateCustomerLeadInput>(input, new CreateCustomerLeadInput(input));

    const inputCustomer = new Customer(
      validInput.phone,
      validInput.email,
      validInput.fullName,
      validInput.zip,
      validInput.energyConsumption,
    );

    const salesAgent =
      validInput.salesAgentLicenseId !== null
        ? await this.crmGateway.findSalesAgentByLicenseId(validInput.salesAgentLicenseId)
        : await this.crmGateway.findSalesAgentByEmail(validInput.salesAgentEmail!);
    if (salesAgent === null) {
      if (validInput.salesAgentLicenseId !== null) {
        throw SalesAgentNotFound.byLicenseId(locale, validInput.salesAgentLicenseId);
      }
      throw SalesAgentNotFound.byEmail(locale, validInput.salesAgentEmail || '');
    }

    let customer = await this.crmGateway.findCustomerByPhone(inputCustomer.getPhone());
    if (customer === null) {
      logger.info(`creating new customer for ${inputCustomer.getPhone()}`);
      customer = await this.crmGateway.createCustomer(inputCustomer, salesAgent);
    }

    let customerLead = await this.crmGateway.findCustomerLeadByCustomer(customer, salesAgent);
    if (customerLead != null) {
      logger.warn(`lead for customer ${customer.getPhone()}, already exists: ${customerLead.id}`);
      throw new CustomerLeadAlreadExists(locale, customer.getPhone());
    }

    customerLead = await this.crmGateway.createCustomerLead(customer, salesAgent);
    return new CreateCustomerLeadOutput(customerLead.id);
  }
}
