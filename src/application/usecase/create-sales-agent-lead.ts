import type { Locale } from 'sms-api-commons';
import { convertAndValidateInput, Logger } from 'sms-api-commons';

import SalesAgent from '../../domain/entity/sales-agent';
import SalesAgentLeadAlreadExists from '../../domain/errors/sales-agent-lead-alread-exists';
import CrmGateway from '../../infra/crm-gateway/crm-gateway';
import CreateSalesAgentLeadInput from '../dto/input/create-sales-agent-lead-input';
import type CreateCustomerLeadOutput from '../dto/output/create-customer-lead-output';
import CreateSalesAgentLeadOutput from '../dto/output/create-sales-agent-lead-output';

export default class CreateSalesAgentLead {
  constructor(readonly crmGateway: CrmGateway) {}

  async execute(locale: Locale, input: any): Promise<CreateCustomerLeadOutput> {
    const logger = Logger.get();
    const validInput = convertAndValidateInput<CreateSalesAgentLeadInput>(input, new CreateSalesAgentLeadInput(input));

    const inputSalesAgent = new SalesAgent(
      validInput.licenseId,
      validInput.phone,
      validInput.email,
      validInput.fullName,
      validInput.occupation,
      validInput.cityAndState,
      validInput.agency,
    );

    let salesAgent =
      inputSalesAgent.licenseId != null
        ? await this.crmGateway.findSalesAgentByLicenseId(inputSalesAgent.licenseId)
        : await this.crmGateway.findSalesAgentByEmail(inputSalesAgent.email);

    if (salesAgent === null) {
      logger.info(`creating new sales agent for ${inputSalesAgent.licenseId || inputSalesAgent.email}`);
      salesAgent = await this.crmGateway.createSalesAgent(inputSalesAgent);
    }

    let salesAgentLead = await this.crmGateway.findSalesAgentLeadBySalesAgent(salesAgent);
    if (salesAgentLead != null) {
      logger.warn(`lead for sales agent ${inputSalesAgent.email}, already exists: ${salesAgentLead.id}`);
      throw new SalesAgentLeadAlreadExists(locale, inputSalesAgent.licenseId || inputSalesAgent.email);
    }

    salesAgentLead = await this.crmGateway.createSalesAgentLead(salesAgent);
    return new CreateSalesAgentLeadOutput(salesAgentLead.id);
  }
}
