import Phone from './phone';

class Customer {
  private readonly phone: Phone;

  constructor(phone: string, readonly email: string, readonly energyConsumption: number) {
    this.phone = new Phone(phone);
  }
}

export default Customer;
