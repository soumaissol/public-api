import { faker } from '@faker-js/faker';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import constants from './constants';

describe('IntegrationTest CreateSalesAgentLead', () => {
  const existentAgencyIds = ['751149013', '752029611'];
  it(
    'should return error when input is invalid',
    async () => {
      try {
        await axios.post(`${constants.API_URL}/salesAgentLead`, {
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
    'should return new sales agent lead when all input is valid',
    async () => {
      const output = await axios.post(`${constants.API_URL}/salesAgentLead`, {
        phone: faker.phone.number('+## ## #####-####'),
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        licenseId: faker.number.int(1000000).toString(),
        agencyIds: existentAgencyIds,
      });
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.leadId).not.toBeUndefined();
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return new sales agent lead when all input is valid without licenseId',
    async () => {
      const output = await axios.post(`${constants.API_URL}/salesAgentLead`, {
        phone: faker.phone.number('+## ## #####-####'),
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        agencyIds: existentAgencyIds,
      });
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.leadId).not.toBeUndefined();
    },
    constants.DEFAULT_TIMEOUT,
  );

  it(
    'should return old sales agent lead when same request is called again',
    async () => {
      const input = {
        phone: faker.phone.number('+## ## #####-####'),
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        licenseId: faker.number.int(1000000).toString(),
        agencyIds: existentAgencyIds,
      };
      const output = await axios.post(`${constants.API_URL}/salesAgentLead`, input);
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.leadId).not.toBeUndefined();
      try {
        await axios.post(`${constants.API_URL}/salesAgentLead`, input);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('sales_agent_lead_alread_exists');
        expect(response.data.message).toBe(`sales agent lead alread exists for ${input.licenseId}`);
      }
    },
    constants.DEFAULT_TIMEOUT * 2,
  );

  it(
    'should return old sales agent lead when same request is called again without license id',
    async () => {
      const input = {
        phone: faker.phone.number('+## ## #####-####'),
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        agencyIds: existentAgencyIds,
      };
      const output = await axios.post(`${constants.API_URL}/salesAgentLead`, input);
      expect(output.status).toBe(HttpStatus.OK);
      expect(output.data.leadId).not.toBeUndefined();
      try {
        await axios.post(`${constants.API_URL}/salesAgentLead`, input);
      } catch (err) {
        expect(err).toHaveProperty('response');
        const response = (err as any).response;
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.data.code).toBe('sales_agent_lead_alread_exists');
        expect(response.data.message).toBe(`sales agent lead alread exists for ${input.email}`);
      }
    },
    constants.DEFAULT_TIMEOUT * 2,
  );
});
