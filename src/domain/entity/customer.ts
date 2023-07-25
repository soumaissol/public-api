import Phone from './phone';

class Customer {
  private readonly phone: Phone;

  constructor(
    phone: string,
    readonly email: string,
    readonly fullName: string,
    readonly zip: string,
    readonly energyConsumption: number,
    readonly id: string | null = null,
  ) {
    this.phone = new Phone(phone);
  }

  public static buildCustomer(customer: Customer, id: string) {
    return new Customer(
      customer.phone.getValue(),
      customer.email,
      customer.fullName,
      customer.zip,
      customer.energyConsumption,
      id,
    );
  }

  public getPhone(): string {
    return this.phone.getValue();
  }
}

export default Customer;
