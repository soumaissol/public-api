import { LendingCompany } from '../../domain/entity/lending-company';
import { Simulation } from '../../domain/entity/simulation';
import SolarEnergyInstalation from '../../domain/entity/solar-energy-instalation';
import SolarEnergyGateway from '../../infra/solar-energy-gateway/solar-energy-gateway';
import CalulateSimulationInput from '../dto/input/calculate-simulation-input';
import { convertAndValidateInput } from '../dto/input/common-input';
import CalulateSimulationOutput from '../dto/output/calculate-simulation-output';
import Logger from '../logger/logger';

export default class CalculateSimulation {
  constructor(readonly solarEnergyGateway: SolarEnergyGateway) {}

  async execute(input: any): Promise<CalulateSimulationOutput> {
    const logger = Logger.get();
    const validInput = convertAndValidateInput<CalulateSimulationInput>(input, new CalulateSimulationInput(input));

    let solarEnergyInstalation = SolarEnergyInstalation.buildBasicSolarEnergyInstalation(validInput.energyConsumption);
    try {
      solarEnergyInstalation = await this.solarEnergyGateway.calculateInstallationSimulation(
        validInput.zip,
        validInput.energyConsumption,
        validInput.powerDistributorId,
      );
    } catch (err: any) {
      logger.warn(`error on solarEnergyGateway: ${err.message}`);
    }

    const lendingCompany = new LendingCompany(0.0241);
    const simulation = new Simulation(lendingCompany, validInput.energyConsumption);

    const bestSimulationOption = simulation.simulateLoanForClient(solarEnergyInstalation.estimatedCost);

    return new CalulateSimulationOutput(
      bestSimulationOption.fixedMonthlyAmount,
      bestSimulationOption.installments,
      bestSimulationOption.paybackInMonths,
    );
  }
}
