interface LoanOption {
  installments: number;
  fixedMonthlyAmount: number;
}

class LendingCompany {
  public readonly installmentOptions: number[];

  constructor(readonly lendingMonthlyFee: number) {
    this.installmentOptions = [12, 24, 36, 48, 60, 72, 84];
  }

  simulateFixedMonthlyLoanInstallmentOptions(totalAmmount): LoanOption[] {
    const simulationOptions: LoanOption[] = [];
    this.installmentOptions.forEach((installmentOption) => {
      const monthlyFeeExponent = (1 + this.lendingMonthlyFee) ** installmentOption;
      const fixedMonthlyAmount = totalAmmount * this.lendingMonthlyFee * monthlyFeeExponent / (monthlyFeeExponent - 1);
      simulationOptions.push({
        installments: installmentOption,
        fixedMonthlyAmount: Math.round(fixedMonthlyAmount * 100) / 100,
      });
    });
    return simulationOptions;
  }

}

export { LendingCompany, LoanOption };
