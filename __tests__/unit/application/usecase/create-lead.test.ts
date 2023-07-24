import InvalidInput from '../../../../src/application/errors/invalid-input';
import EmptyInput from '../../../../src/application/errors/empty-input';
import CreateLead from '../../../../src/application/usecase/create-lead';
import InvalidPhone from '../../../../src/domain/errors/invalid-phone';
import SalesAgentNotFound from '../../../../src/domain/errors/sales-agent-not-found';
import SalesAgent from '../../../../src/domain/entity/sales-agent';
import CreateLeadOutput from '../../../../src/application/dto/output/create-lead-output';

const fakeCrmGateway = {
  findSalesAgent: jest.fn(),
};

describe('Test CreateLead usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid phone', 'invalid_phone'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({ phone: '11123456789', email: 'email.com' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when fullName is not valid', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({
        phone: '11123456789', email: 'user@email.com',
        fullName: 1,
      }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid full name', 'invalid_full_name'));
    }
  });

  it('should return error when zip is not valid', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({
        phone: '11123456789', email: 'user@email.com',
        fullName: 'Meu nome', zip: '1234',
      }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid zip', 'invalid_zip'));
    }
  });

  it('should return error when energyConsumption is not valid', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({
        phone: '11123456789', email: 'user@email.com',
        fullName: 'Meu nome', zip: '12345678',
        energyConsumption: -100,
      }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid energyConsumption', 'invalid_energy_consumption'));
    }
  });

  it('should return error when salesAgentLicenseId is not valid', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({
        phone: '11123456789', email: 'user@email.com',
        fullName: 'Meu nome', zip: '12345678',
        energyConsumption: 100, salesAgentLicenseId: -100,
      }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid sales agent license id', 'invalid_sales_agent_license_id'));
    }
  });

  it('should return error when phone is not valid', async () => {
    try {
      const createLead = new CreateLead(fakeCrmGateway);

      await createLead.execute(JSON.stringify({
        phone: '12345', email: 'user@email.com',
        fullName: 'Meu nome', zip: '12345678',
        energyConsumption: 100, salesAgentLicenseId: '178123',
      }));
    } catch (err) {
      expect(err).toEqual(new InvalidPhone());
    }
  });

  it('should return error when sales agent is not found', async () => {
    const fakeCrmGateway = {
      findSalesAgent: jest.fn().mockResolvedValueOnce(null),
    };
    const createLead = new CreateLead(fakeCrmGateway);
    const salesAgentLicenseId = '178123';

    try {
      await createLead.execute(JSON.stringify({
        phone: '11123456789', email: 'user@email.com',
        fullName: 'Meu nome', zip: '12345678',
        energyConsumption: 100, salesAgentLicenseId,
      }));
    } catch (err) {
      expect(err).toEqual(new SalesAgentNotFound(salesAgentLicenseId));

      expect(fakeCrmGateway.findSalesAgent).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findSalesAgent.mock.calls[0][0]).toBe(salesAgentLicenseId);
    }
  });

  it('should return sucess when all is valid', async () => {
    const salesAgentLicenseId = '178123';

    const fakeCrmGateway = {
      findSalesAgent: jest.fn().mockResolvedValueOnce(new SalesAgent('sa-id-1', salesAgentLicenseId)),
    };
    const createLead = new CreateLead(fakeCrmGateway);
    const result = await createLead.execute(JSON.stringify({
      phone: '11123456789', email: 'user@email.com',
      fullName: 'Meu nome', zip: '12345678',
      energyConsumption: 100, salesAgentLicenseId,
    }));

    expect(fakeCrmGateway.findSalesAgent).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findSalesAgent.mock.calls[0][0]).toBe(salesAgentLicenseId);
    expect(result).toEqual(new CreateLeadOutput(null));
  });
});
