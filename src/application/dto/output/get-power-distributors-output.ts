
class PowerDistributorOutput {
  constructor(readonly id: number, readonly name: string, readonly price: number) {
  }
}

class GetPowerDistributorsOutput {
  constructor(readonly addressName: string, readonly city: string, readonly state: string,
    readonly sa: string, readonly powerDistributors: PowerDistributorOutput[]) {
  }
}

export { GetPowerDistributorsOutput, PowerDistributorOutput };
