import { LendingCompany } from '../../../../src/domain/entity/lending-company';
import { Simulation } from '../../../../src/domain/entity/simulation';

describe('Test Simulation', () => {
  it('should simulate for client and return the best option', () => {
    const lendingCompany = new LendingCompany(0.0241);
    const simulation = new Simulation(lendingCompany, 1000);

    const result = simulation.simulateLoanForClient(18207.6);

    expect(result).toEqual({
      fixedMonthlyAmount: 762.21,
      installments: 36,
      paybackInMonths: 19,
    });
  });

  it('should simulate for client and return the wrost option', () => {
    const lendingCompany = new LendingCompany(0.0241);
    const simulation = new Simulation(lendingCompany, 100);

    const result = simulation.simulateLoanForClient(18207.6);

    expect(result).toEqual({
      fixedMonthlyAmount: 577.06,
      installments: 60,
      paybackInMonths: 183,
    });
  });
});
