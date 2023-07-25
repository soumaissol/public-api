import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest CreateCustomerLead', () => {
  const existentSalesAgentLicenseId = '178123';
  it(
    'should return error when input is invalid',
    async () => {
      try {
        await axios.post(`${constants.API_URL}/customerLead`, {
          phone: '111234',
          email: 'email.com',
        });
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('invalid_email');
        expect(response.data.message).toBe('invalid email');
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return error when sales agent is not found',
    async () => {
      const salesAgentLicenseId = '1';
      try {
        await axios.post(`${constants.API_URL}/customerLead`, {
          phone: faker.phone.number('+## ## #####-####'),
          email: faker.internet.email(),
          fullName: faker.person.fullName(),
          zip: faker.location.zipCode('########'),
          energyConsumption: faker.number.int(10000),
          salesAgentLicenseId,
        });
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('sales_agent_not_found');
        expect(response.data.message).toBe(`sales agent not found for id ${salesAgentLicenseId}`);
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return new customer lead when all input is valid',
    async () => {
      try {
        const output = await axios.post(`${constants.API_URL}/customerLead`, {
          phone: faker.phone.number('+## ## #####-####'),
          email: faker.internet.email(),
          fullName: faker.person.fullName(),
          zip: faker.location.zipCode('########'),
          energyConsumption: faker.number.int(10000),
          salesAgentLicenseId: existentSalesAgentLicenseId,
        });
        expect(output.status).toBe(HttpStatus.OK);
        expect(output.data.leadId).not.toBeUndefined();
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('sales_agent_not_found');
        expect(response.data.message).toBe(`sales agent not found for id`);
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return old customer lead when same request is called again',
    async () => {
      const input = {
        phone: faker.phone.number('+## ## #####-####'),
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        zip: faker.location.zipCode('########'),
        energyConsumption: faker.number.int(10000),
        salesAgentLicenseId: existentSalesAgentLicenseId,
      };
      const output = await axios.post(`${constants.API_URL}/customerLead`, input);
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.leadId).not.toBeUndefined();
      try {
        await axios.post(`${constants.API_URL}/customerLead`, input);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('customer_lead_alread_exists');
      }
    },
    constants.DEFAULT_TIMEOUT * 2,
  );
});
