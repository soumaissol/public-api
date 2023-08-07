import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest GetPowerDistributors', () => {
  it(
    'should return error when input is invalid',
    async () => {
      try {
        await axios.get(`${constants.API_URL}/simulations/power-distributors/123`);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('invalid_zip');
        expect(response.data.message).toBe('invalid zip');
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return translated error when input is invalid',
    async () => {
      try {
        await axios.get(`${constants.API_URL}/simulations/power-distributors/123`, {
          headers: {
            'Accept-Language': constants.PTBR_ACCEPTED_LANGUAGE,
          },
        });
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('invalid_zip');
        expect(response.data.message).toBe('cep inválido');
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return listing when zip is valid',
    async () => {
      const output = await axios.get(`${constants.API_URL}/simulations/power-distributors/12312123`);
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.addressName).toBe('Rua Rubens Meireles');
      expect(output.data.city).toBe('São Paulo');
      expect(output.data.state).toBe('São Paulo');
      expect(output.data.sa).toBe('SP');
      expect(output.data.powerDistributors.length).toBe(2);
      expect(output.data.powerDistributors[0].id).toBe(115);
      expect(output.data.powerDistributors[0].name).toBe('Cedrap');
      expect(output.data.powerDistributors[0].price).toBe(0.8);
      expect(output.data.powerDistributors[1].id).toBe(116);
      expect(output.data.powerDistributors[1].name).toBe('Cedri');
      expect(output.data.powerDistributors[1].price).toBe(0.74);
    },
    constants.DEFAULT_TIMEOUT,
  );
});
