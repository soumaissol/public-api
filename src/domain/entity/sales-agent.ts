import Phone from './phone';

class SalesAgent {
  private readonly phone: Phone;

  constructor(
    readonly licenseId: string | null,
    phone: string,
    readonly email: string,
    readonly fullName: string,
    readonly agency: string | null,
    readonly id: string | null = null,
  ) {
    this.phone = new Phone(phone);
  }

  public static buildSalesAgent(salesAgent: SalesAgent, id: string) {
    return new SalesAgent(
      salesAgent.licenseId,
      salesAgent.getPhone(),
      salesAgent.email,
      salesAgent.fullName,
      salesAgent.agency,
      id,
    );
  }

  public getPhone(): string {
    return this.phone.getValue();
  }
}

export default SalesAgent;
