export default class CalulateSimulationOutput {
  constructor(
    readonly monthlyLoanInstallmentAmount: number,
    readonly monthlyLoanInstallments: number,
    readonly paybackInMonths: number,
  ) {}
}
