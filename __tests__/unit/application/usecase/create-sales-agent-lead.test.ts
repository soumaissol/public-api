import EmptyInput from '../../../../src/application/errors/empty-input';
import InvalidInput from '../../../../src/application/errors/invalid-input';
import CreateSalesAgentLead from '../../../../src/application/usecase/create-sales-agent-lead';
import SalesAgent from '../../../../src/domain/entity/sales-agent';
import SalesAgentLead from '../../../../src/domain/entity/sales-agent-lead';
import SalesAgentLeadAlreadExists from '../../../../src/domain/errors/sales-agent-lead-alread-exists';

const buildFakeCrmGateway = () => {
  return {
    createSalesAgentLead: jest.fn(),
    findCustomerLeadByCustomer: jest.fn(),
    createCustomer: jest.fn(),
    findCustomerByPhone: jest.fn(),
    findSalesAgentByLicenseId: jest.fn(),
    createCustomerLead: jest.fn(),
    findSalesAgentLeadBySalesAgent: jest.fn(),
    createSalesAgent: jest.fn(),
    findSalesAgentByEmail: jest.fn(),
  };
};

describe('Test CreateSalesAgentLead usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(null);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(JSON.stringify({}));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid phone', 'invalid_phone'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(JSON.stringify({ phone: '11123456789', email: 'email.com' }));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when fullName is not valid', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 1,
        }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid full name', 'invalid_full_name'));
    }
  });

  it('should return error when licenseId is not valid', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          licenseId: 1,
        }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid license id', 'invalid_license_id'));
    }
  });

  it('should return error when agencyIds is not valid', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          licenseId: '1',
        }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid agency ids', 'invalid_agency_ids'));
    }
  });

  it('should return error when agencyIds item is not valid', async () => {
    try {
      const createSalesAgentLead = new CreateSalesAgentLead(buildFakeCrmGateway());

      await createSalesAgentLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          licenseId: '1',
          agencyIds: ['1', 2],
        }),
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid agency ids', 'invalid_agency_ids'));
    }
  });

  it('should return error when sales agent lead already exists', async () => {
    const input = {
      phone: '11123456789',
      email: 'user@email.com',
      fullName: 'Meu nome',
      licenseId: '1',
      agencyIds: ['1', '2'],
    };
    const salesAgent = new SalesAgent(
      input.licenseId,
      input.phone,
      input.email,
      input.fullName,
      input.agencyIds,
      'sa-id-1',
    );

    const fakeCrmGateway = {
      ...buildFakeCrmGateway(),
      findSalesAgentByLicenseId: jest.fn().mockResolvedValueOnce(salesAgent),
      findSalesAgentLeadBySalesAgent: jest.fn().mockResolvedValueOnce(new SalesAgentLead('lead-id-1', salesAgent)),
    };
    const createSalesAgentLead = new CreateSalesAgentLead(fakeCrmGateway);

    try {
      await createSalesAgentLead.execute(JSON.stringify(input));
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toEqual(new SalesAgentLeadAlreadExists(salesAgent.licenseId!));

      expect(fakeCrmGateway.findSalesAgentByLicenseId).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findSalesAgentByLicenseId.mock.calls[0][0]).toBe(input.licenseId);

      expect(fakeCrmGateway.findSalesAgentLeadBySalesAgent).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findSalesAgentLeadBySalesAgent.mock.calls[0][0]).toBe(salesAgent);
    }
  });

  it('should create new sales agent lead when all is valid', async () => {
    const input = {
      phone: '11123456789',
      email: 'user@email.com',
      fullName: 'Meu nome',
      licenseId: '1',
      agencyIds: ['1', '2'],
    };
    const salesAgent = new SalesAgent(
      input.licenseId,
      input.phone,
      input.email,
      input.fullName,
      input.agencyIds,
      'sa-id-1',
    );
    const salesAgentLead = new SalesAgentLead('lead-id-1', salesAgent);

    const fakeCrmGateway = {
      ...buildFakeCrmGateway(),
      findSalesAgentByLicenseId: jest.fn().mockResolvedValueOnce(null),
      createSalesAgent: jest.fn().mockResolvedValueOnce(salesAgent),
      findSalesAgentLeadBySalesAgent: jest.fn().mockResolvedValueOnce(null),
      createSalesAgentLead: jest.fn().mockResolvedValueOnce(salesAgentLead),
    };
    const createSalesAgentLead = new CreateSalesAgentLead(fakeCrmGateway);

    await createSalesAgentLead.execute(JSON.stringify(input));

    expect(fakeCrmGateway.findSalesAgentByLicenseId).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findSalesAgentByLicenseId.mock.calls[0][0]).toBe(input.licenseId);

    expect(fakeCrmGateway.createSalesAgent).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.createSalesAgent.mock.calls[0][0]).toEqual(
      new SalesAgent(input.licenseId, input.phone, input.email, input.fullName, input.agencyIds),
    );

    expect(fakeCrmGateway.findSalesAgentLeadBySalesAgent).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findSalesAgentLeadBySalesAgent.mock.calls[0][0]).toBe(salesAgent);

    expect(fakeCrmGateway.createSalesAgentLead).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.createSalesAgentLead.mock.calls[0][0]).toBe(salesAgent);
  });

  it('should create new sales agent lead when all is valid without license id', async () => {
    const input = {
      phone: '11123456789',
      email: 'user@email.com',
      fullName: 'Meu nome',
      agencyIds: ['1', '2'],
    };
    const salesAgent = new SalesAgent(null, input.phone, input.email, input.fullName, input.agencyIds, 'sa-id-1');
    const salesAgentLead = new SalesAgentLead('lead-id-1', salesAgent);

    const fakeCrmGateway = {
      ...buildFakeCrmGateway(),
      findSalesAgentByEmail: jest.fn().mockResolvedValueOnce(null),
      createSalesAgent: jest.fn().mockResolvedValueOnce(salesAgent),
      findSalesAgentLeadBySalesAgent: jest.fn().mockResolvedValueOnce(null),
      createSalesAgentLead: jest.fn().mockResolvedValueOnce(salesAgentLead),
    };
    const createSalesAgentLead = new CreateSalesAgentLead(fakeCrmGateway);

    await createSalesAgentLead.execute(JSON.stringify(input));

    expect(fakeCrmGateway.findSalesAgentByLicenseId).toHaveBeenCalledTimes(0);

    expect(fakeCrmGateway.findSalesAgentByEmail).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findSalesAgentByEmail.mock.calls[0][0]).toBe(input.email);

    expect(fakeCrmGateway.createSalesAgent).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.createSalesAgent.mock.calls[0][0]).toEqual(
      new SalesAgent(null, input.phone, input.email, input.fullName, input.agencyIds),
    );

    expect(fakeCrmGateway.findSalesAgentLeadBySalesAgent).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findSalesAgentLeadBySalesAgent.mock.calls[0][0]).toBe(salesAgent);

    expect(fakeCrmGateway.createSalesAgentLead).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.createSalesAgentLead.mock.calls[0][0]).toBe(salesAgent);
  });
});
