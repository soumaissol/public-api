import { LendingCompany } from '../../../../src/domain/entity/lending-company';

describe('Test LendingCompany', () => {
  it('should simulate fixedMonthlyAmount for all options', () => {
    const lendingCompany = new LendingCompany(0.0241);

    const result = lendingCompany.simulateFixedMonthlyLoanInstallmentOptions(18207.6);

    expect(result).toEqual([
      {
        fixedMonthlyAmount: 1765.35,
        installments: 12,
      },
      {
        fixedMonthlyAmount: 1007.94,
        installments: 24,
      },
      {
        fixedMonthlyAmount: 762.21,
        installments: 36,
      },
      {
        fixedMonthlyAmount: 644.2,
        installments: 48,
      },
      {
        fixedMonthlyAmount: 577.06,
        installments: 60,
      },
      {
        fixedMonthlyAmount: 535.15,
        installments: 72,
      },
      {
        fixedMonthlyAmount: 507.45,
        installments: 84,
      },
    ]);
  });
});
