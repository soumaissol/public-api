import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest CalculateSimulation', () => {
  it('should return error when input is invalid', async () => {
    try {
      await axios.post(`${constants.API_URL}/simulations/calculate`, {
        powerDistributorId: 'powerDistributorId',
      });
    } catch (err) {
      expect(err).toHaveProperty('response');
      const response = (err as any).response;
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.data.code).toBe('invalid_power_distributor_id');
      expect(response.data.message).toBe('invalid powerDistributorId');
    }
  }, constants.DEFAULT_TIMEOUT);

  it('should return simulation when all input is valid', async () => {
    const output = await axios.post(`${constants.API_URL}/simulations/calculate`, {
      powerDistributorId: 1,
      email: 'user@email.com',
      energyConsumption: 100,
      zip: '12323123',
    });
    expect(output.status).toBe(HttpStatus.OK);
    expect(output.data.monthlyLoanInstallmentAmount).toBe(530.58);
    expect(output.data.monthlyLoanInstallments).toBe(60);
    expect(output.data.paybackInMonths).toBe(168);
  }, constants.DEFAULT_TIMEOUT);
});
