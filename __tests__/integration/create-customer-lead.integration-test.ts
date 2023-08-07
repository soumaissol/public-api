import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest CreateCustomerLead', () => {
  const existentSalesAgentLicenseId = '178123';
  const existentSalesAgentEmail = 'fake2@email.com';
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
        expect(response.data.code).toBe('sales_agent_license_id_and_email_null');
        expect(response.data.message).toBe('sales agent license id or email must be given to identify');
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
        expect(response.data.message).toBe(`sales agent not found for license id ${salesAgentLicenseId}`);
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return translated error when sales agent is not found by license id',
    async () => {
      const salesAgentLicenseId = '1';
      try {
        await axios.post(
          `${constants.API_URL}/customerLead`,
          {
            phone: faker.phone.number('+## ## #####-####'),
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
            zip: faker.location.zipCode('########'),
            energyConsumption: faker.number.int(10000),
            salesAgentLicenseId,
          },
          {
            headers: {
              'Accept-Language': constants.PTBR_ACCEPTED_LANGUAGE,
            },
          },
        );
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('sales_agent_not_found');
        expect(response.data.message).toBe(
          `Não foi possível localizar um corretor cadastrado com o CRECI ${salesAgentLicenseId}`,
        );
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return translated error when sales agent is not found',
    async () => {
      const salesAgentEmail = faker.internet.email();
      try {
        await axios.post(
          `${constants.API_URL}/customerLead`,
          {
            phone: faker.phone.number('+## ## #####-####'),
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
            zip: faker.location.zipCode('########'),
            energyConsumption: faker.number.int(10000),
            salesAgentEmail,
          },
          {
            headers: {
              'Accept-Language': constants.PTBR_ACCEPTED_LANGUAGE,
            },
          },
        );
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('sales_agent_not_found');
        expect(response.data.message).toBe(
          `Não foi possível localizar um corretor cadastrado com o e-mail ${salesAgentEmail}`,
        );
      }
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return new customer lead when all input is valid',
    async () => {
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
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return new customer lead when all input is valid again',
    async () => {
      const output = await axios.post(`${constants.API_URL}/customerLead`, {
        phone: faker.phone.number('+## ## #####-####'),
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        zip: faker.location.zipCode('########'),
        energyConsumption: faker.number.int(10000),
        salesAgentEmail: existentSalesAgentEmail,
      });
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.leadId).not.toBeUndefined();
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
