import Logger from '../logger/logger';
import { convertAndValidateInput } from '../dto/input/common-input';
import CrmGateway from '../../infra/crm-gateway/crm-gateway';
import CreateLeadOutput from '../dto/output/create-lead-output';
import CreateLeadInput from '../dto/input/create-lead-input';
import SalesAgentNotFound from '../../domain/errors/sales-agent-not-found';
import Customer from '../../domain/entity/customer';

export default class CreateLead {
  constructor(readonly crmGateway: CrmGateway) { }

  async execute(input: any): Promise<CreateLeadOutput> {
    const logger = Logger.get();
    const validInput = convertAndValidateInput<CreateLeadInput>(input, new CreateLeadInput(input));

    const customer = new Customer(validInput.phone, validInput.email, validInput.energyConsumption);

    const salesAgent = await this.crmGateway.findSalesAgent(validInput.salesAgentLicenseId);
    if (salesAgent === null) {
      throw new SalesAgentNotFound(validInput.salesAgentLicenseId);
    }

    // const client = new Client(validInput.energyConsumption);
    // const lendingCompany = new LendingCompany(0.0241);
    // const simulation = new Simulation(lendingCompany, client);

    // const bestSimulationOption = simulation.simulateLoanForClient(solarEnergyInstalation.estimatedCost);

    return new CreateLeadOutput(
      null,
    );
  }
}
