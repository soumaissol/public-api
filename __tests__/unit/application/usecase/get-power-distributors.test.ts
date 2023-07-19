import InvalidInput from '../../../../src/application/errors/invalid-input';
import EmptyInput from '../../../../src/application/errors/empty-input';
import FakeSolarEnergyGateway from '../../../../src/infra/solar-energy-gateway/fake-solar-energy-gateway';
import GetPowerDistributors from '../../../../src/application/usecase/get-power-distributors';
import SolarEnergyGateway from '../../../../src/infra/solar-energy-gateway/solar-energy-gateway';

describe('Test GetPowerDistributors usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const getPowerDistributors = new GetPowerDistributors(new FakeSolarEnergyGateway());

      await getPowerDistributors.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is broken json', async () => {
    try {
      const getPowerDistributors = new GetPowerDistributors(new FakeSolarEnergyGateway());

      await getPowerDistributors.execute('}');
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid zip', 'invalid_zip'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const getPowerDistributors = new GetPowerDistributors(new FakeSolarEnergyGateway());

      await getPowerDistributors.execute(JSON.stringify({ zip: '123' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid zip', 'invalid_zip'));
    }
  });

  it('should return listing when all is valid', async () => {
    const getPowerDistributors = new GetPowerDistributors(new FakeSolarEnergyGateway());
    const result = await getPowerDistributors.execute(JSON.stringify({ zip: '12323123' }));
    expect(result).toEqual({
      addressName: 'Rua Rubens Meireles', city: 'São Paulo', state: 'São Paulo',
      sa: 'SP', powerDistributors: [{ id: 115, name: 'Cedrap', price: 0.8 },
      { id: 116, name: 'Cedri', price: 0.74 }],
    });
  });

  it('should return null when when energy solar gateway fails', async () => {
    const solarEnergyGatewayMock: SolarEnergyGateway = {
      calculateInstallationSimulation: jest.fn(),
      getPowerDistributorListing: jest.fn().mockImplementationOnce(() => {
        throw new Error('unknow error');
      }),
    };

    const getPowerDistributors = new GetPowerDistributors(solarEnergyGatewayMock);
    const result = await getPowerDistributors.execute(JSON.stringify({ zip: '12323123' }));
    expect(result).toBeNull();
  });
});
