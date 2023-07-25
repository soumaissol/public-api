import EmptyInput from '../../../../src/application/errors/empty-input';
import InvalidInput from '../../../../src/application/errors/invalid-input';
import CalculateSimulation from '../../../../src/application/usecase/calculate-simulation';
import FakeSolarEnergyGateway from '../../../../src/infra/solar-energy-gateway/fake-solar-energy-gateway';
import type SolarEnergyGateway from '../../../../src/infra/solar-energy-gateway/solar-energy-gateway';

describe('Test CalculateSimulation usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());

      await calculateSimulation.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());

      await calculateSimulation.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid powerDistributorId', 'invalid_power_distributor_id'));
    }
  });

  it('should return error when powerDistributorId is not a number', async () => {
    try {
      const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());

      await calculateSimulation.execute(JSON.stringify({ powerDistributorId: 'powerDistributorId' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid powerDistributorId', 'invalid_power_distributor_id'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());

      await calculateSimulation.execute(JSON.stringify({ powerDistributorId: 1, email: 'email.com' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when energyConsumption is not valid', async () => {
    try {
      const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());

      await calculateSimulation.execute(
        JSON.stringify({
          powerDistributorId: 1,
          email: 'user@email.com',
          energyConsumption: '-100',
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid energyConsumption', 'invalid_energy_consumption'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());

      await calculateSimulation.execute(
        JSON.stringify({
          powerDistributorId: 1,
          email: 'user@email.com',
          energyConsumption: 100,
          zip: '123',
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid zip', 'invalid_zip'));
    }
  });

  it('should return the best opotion when energy solar gateway fails', async () => {
    const solarEnergyGatewayMock: SolarEnergyGateway = {
      calculateInstallationSimulation: jest.fn().mockImplementationOnce(() => {
        throw new Error('unknow error');
      }),
      getPowerDistributorListing: jest.fn(),
    };
    const calculateSimulation = new CalculateSimulation(solarEnergyGatewayMock);
    const result = await calculateSimulation.execute(
      JSON.stringify({
        powerDistributorId: 1,
        email: 'user@email.com',
        energyConsumption: 100,
        zip: '12323123',
      }),
    );
    expect(result).toEqual({ monthlyLoanInstallmentAmount: 193.33, monthlyLoanInstallments: 60, paybackInMonths: 61 });
  });

  it('should return the best option when all is valid', async () => {
    const calculateSimulation = new CalculateSimulation(new FakeSolarEnergyGateway());
    const result = await calculateSimulation.execute(
      JSON.stringify({
        powerDistributorId: 1,
        email: 'user@email.com',
        energyConsumption: 100,
        zip: '12323123',
      }),
    );
    expect(result).toEqual({ monthlyLoanInstallmentAmount: 530.58, monthlyLoanInstallments: 60, paybackInMonths: 168 });
  });
});
