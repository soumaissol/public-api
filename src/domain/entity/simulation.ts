import { LendingCompany } from './lending-company';

interface SimulationResult {
  installments: number;
  fixedMonthlyAmount: number;
  paybackInMonths: number;
}

class Simulation {
  constructor(readonly lengingCompany: LendingCompany, readonly energyConsumption: number) {
  }

  simulateLoanForClient(totalAmmount): SimulationResult {
    const simulationOptions = this.lengingCompany.simulateFixedMonthlyLoanInstallmentOptions(totalAmmount);
    for (const { fixedMonthlyAmount, installments } of simulationOptions) {
      if (this.energyConsumption >= fixedMonthlyAmount || installments === 60) {
        return {
          fixedMonthlyAmount,
          installments,
          paybackInMonths: Math.ceil(totalAmmount / this.energyConsumption),
        };
      }
    }

    return {
      fixedMonthlyAmount: simulationOptions[simulationOptions.length - 1].fixedMonthlyAmount,
      installments: simulationOptions[simulationOptions.length - 1].installments,
      paybackInMonths: Math.ceil(totalAmmount / this.energyConsumption),
    };
  }
}

export { Simulation, SimulationResult };
