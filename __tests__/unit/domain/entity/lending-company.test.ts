import { LendingCompany } from '../../../../src/domain/entity/lending-company';

describe('Test LendingCompany', () => {
  it('should simulate fixedMonthlyAmount for all options  with fee 2.41', () => {
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

  it('should simulate fixedMonthlyAmount for all options with fee 1.9', () => {
    const lendingCompany = new LendingCompany(0.019);

    const result = lendingCompany.simulateFixedMonthlyLoanInstallmentOptions(18207.6);

    expect(result).toEqual([
      {
        fixedMonthlyAmount: 1711.15,
        installments: 12,
      },
      {
        fixedMonthlyAmount: 951.79,
        installments: 24,
      },
      {
        fixedMonthlyAmount: 702.91,
        installments: 36,
      },
      {
        fixedMonthlyAmount: 581.59,
        installments: 48,
      },
      {
        fixedMonthlyAmount: 511.19,
        installments: 60,
      },
      {
        fixedMonthlyAmount: 466.17,
        installments: 72,
      },
      {
        fixedMonthlyAmount: 435.57,
        installments: 84,
      },
    ]);
  });
});
