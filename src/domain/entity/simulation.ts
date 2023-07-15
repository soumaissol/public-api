import { LendingCompany } from './lending-company';
import Client from './client';

interface SimulationResult {
  installments: number
  fixedMonthlyAmount: number
  paybackInMonths: number
}

class Simulation {
  constructor(readonly lengingCompany: LendingCompany, readonly client: Client) {
  }

  simulateLoanForClient(totalAmmount): SimulationResult {
    const simulationOptions = this.lengingCompany.simulateFixedMonthlyLoanInstallmentOptions(totalAmmount);
    for (const { fixedMonthlyAmount, installments } of simulationOptions) {
      if (this.client.energyConsumption >= fixedMonthlyAmount || installments === 60) {
        return {
          fixedMonthlyAmount,
          installments,
          paybackInMonths: Math.ceil(totalAmmount / this.client.energyConsumption),
        };
      }
    }
  }
}

export { Simulation, SimulationResult };