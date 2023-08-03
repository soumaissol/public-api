import CreateCustomerLeadOutput from '../../../../src/application/dto/output/create-customer-lead-output';
import EmptyInput from '../../../../src/application/errors/empty-input';
import InvalidInput from '../../../../src/application/errors/invalid-input';
import CreateCustomerLead from '../../../../src/application/usecase/create-customer-lead';
import Customer from '../../../../src/domain/entity/customer';
import CustomerLead from '../../../../src/domain/entity/customer-lead';
import SalesAgent from '../../../../src/domain/entity/sales-agent';
import CustomerLeadAlreadExists from '../../../../src/domain/errors/customer-lead-alread-exists';
import InvalidPhone from '../../../../src/domain/errors/invalid-phone';
import SalesAgentNotFound from '../../../../src/domain/errors/sales-agent-not-found';

const buildFakeCrmGateway = () => {
  return {
    createCustomerLead: jest.fn(),
    findCustomerLeadByCustomer: jest.fn(),
    createCustomer: jest.fn(),
    findCustomerByPhone: jest.fn(),
    findSalesAgentByLicenseId: jest.fn(),
    createSalesAgentLead: jest.fn(),
    findSalesAgentLeadBySalesAgent: jest.fn(),
    createSalesAgent: jest.fn(),
    findSalesAgentByEmail: jest.fn(),
  };
};

describe('Test CreateCustomerLead usecase', () => {
  it('should return error when input is null', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(null);
    } catch (err) {
      expect(err).toEqual(new EmptyInput());
    }
  });

  it('should return error when input is empty object', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(JSON.stringify({}));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid phone', 'invalid_phone'));
    }
  });

  it('should return error when email is not valid', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(JSON.stringify({ phone: '11123456789', email: 'email.com' }));
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid email', 'invalid_email'));
    }
  });

  it('should return error when fullName is not valid', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 1,
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid full name', 'invalid_full_name'));
    }
  });

  it('should return error when zip is not valid', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          zip: '1234',
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid zip', 'invalid_zip'));
    }
  });

  it('should return error when energyConsumption is not valid', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          zip: '12345678',
          energyConsumption: -100,
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid energyConsumption', 'invalid_energy_consumption'));
    }
  });

  it('should return error when salesAgentLicenseId is not valid', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          zip: '12345678',
          energyConsumption: 100,
          salesAgentLicenseId: -100,
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidInput('invalid sales agent license id', 'invalid_sales_agent_license_id'));
    }
  });

  it('should return error when phone is not valid', async () => {
    try {
      const createCustomerLead = new CreateCustomerLead(buildFakeCrmGateway());

      await createCustomerLead.execute(
        JSON.stringify({
          phone: '12345',
          email: 'user@email.com',
          fullName: 'Meu nome',
          zip: '12345678',
          energyConsumption: 100,
          salesAgentLicenseId: '178123',
        }),
      );
    } catch (err) {
      expect(err).toEqual(new InvalidPhone());
    }
  });

  it('should return error when sales agent is not found', async () => {
    const fakeCrmGateway = {
      ...buildFakeCrmGateway(),
      findSalesAgentByLicenseId: jest.fn().mockResolvedValueOnce(null),
    };
    const createCustomerLead = new CreateCustomerLead(fakeCrmGateway);
    const salesAgentLicenseId = '178123';

    try {
      await createCustomerLead.execute(
        JSON.stringify({
          phone: '11123456789',
          email: 'user@email.com',
          fullName: 'Meu nome',
          zip: '12345678',
          energyConsumption: 100,
          salesAgentLicenseId,
        }),
      );
    } catch (err) {
      expect(err).toEqual(new SalesAgentNotFound(salesAgentLicenseId));

      expect(fakeCrmGateway.findSalesAgentByLicenseId).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findSalesAgentByLicenseId.mock.calls[0][0]).toBe(salesAgentLicenseId);
    }
  });

  it('should return error when customer lead already exists', async () => {
    const input = {
      phone: '11123456789',
      email: 'user@email.com',
      fullName: 'Meu nome',
      zip: '12345678',
      energyConsumption: 100,
      salesAgentLicenseId: '178123',
    };
    const customer = new Customer(
      input.phone,
      input.email,
      input.fullName,
      input.zip,
      input.energyConsumption,
      'sa-id-1',
    );
    const salesAgent = new SalesAgent(
      input.salesAgentLicenseId,
      '11912341234',
      'sales@agent.com',
      'Sales Agent',
      ['1', '2'],
      'sa-id-1',
    );

    const fakeCrmGateway = {
      ...buildFakeCrmGateway(),
      findSalesAgentByLicenseId: jest.fn().mockResolvedValueOnce(salesAgent),
      findCustomerByPhone: jest.fn().mockResolvedValueOnce(customer),
      findCustomerLeadByCustomer: jest.fn().mockResolvedValueOnce(new CustomerLead('cl-id-1', customer, salesAgent)),
    };
    const createCustomerLead = new CreateCustomerLead(fakeCrmGateway);
    try {
      await createCustomerLead.execute(JSON.stringify(input));
    } catch (err) {
      expect(err).toEqual(new CustomerLeadAlreadExists(customer.id!));

      expect(fakeCrmGateway.findSalesAgentByLicenseId).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findSalesAgentByLicenseId.mock.calls[0][0]).toBe(input.salesAgentLicenseId);

      expect(fakeCrmGateway.findCustomerByPhone).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findCustomerByPhone.mock.calls[0][0]).toBe(customer.getPhone());

      expect(fakeCrmGateway.findCustomerLeadByCustomer).toHaveBeenCalledTimes(1);
      expect(fakeCrmGateway.findCustomerLeadByCustomer.mock.calls[0][0]).toEqual(customer);
      expect(fakeCrmGateway.findCustomerLeadByCustomer.mock.calls[0][1]).toEqual(salesAgent);
    }
  });

  it('should return success when customer lead does not exists', async () => {
    const input = {
      phone: '11123456789',
      email: 'user@email.com',
      fullName: 'Meu nome',
      zip: '12345678',
      energyConsumption: 100,
      salesAgentLicenseId: '178123',
    };
    const customer = new Customer(
      input.phone,
      input.email,
      input.fullName,
      input.zip,
      input.energyConsumption,
      'sa-id-1',
    );
    const salesAgent = new SalesAgent(
      input.salesAgentLicenseId,
      '11912341234',
      'sales@agent.com',
      'Sales Agent',
      ['1', '2'],
      'sa-id-1',
    );
    const customerLead = new CustomerLead('cl-id-1', customer, salesAgent);

    const fakeCrmGateway = {
      ...buildFakeCrmGateway(),
      findSalesAgentByLicenseId: jest.fn().mockResolvedValueOnce(salesAgent),
      findCustomerByPhone: jest.fn().mockResolvedValueOnce(null),
      createCustomer: jest.fn().mockResolvedValueOnce(customer),
      createCustomerLead: jest.fn().mockResolvedValueOnce(customerLead),
    };
    const createCustomerLead = new CreateCustomerLead(fakeCrmGateway);

    const result = await createCustomerLead.execute(JSON.stringify(input));
    expect(result).toEqual(new CreateCustomerLeadOutput(customerLead.id));

    expect(fakeCrmGateway.findSalesAgentByLicenseId).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findSalesAgentByLicenseId.mock.calls[0][0]).toBe(input.salesAgentLicenseId);

    expect(fakeCrmGateway.findCustomerByPhone).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findCustomerByPhone.mock.calls[0][0]).toBe(customer.getPhone());

    expect(fakeCrmGateway.createCustomer).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.createCustomer.mock.calls[0][0]).toEqual(
      new Customer(input.phone, input.email, input.fullName, input.zip, input.energyConsumption),
    );
    expect(fakeCrmGateway.createCustomer.mock.calls[0][1]).toEqual(salesAgent);

    expect(fakeCrmGateway.findCustomerLeadByCustomer).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.findCustomerLeadByCustomer.mock.calls[0][0]).toEqual(customer);
    expect(fakeCrmGateway.findCustomerLeadByCustomer.mock.calls[0][1]).toEqual(salesAgent);

    expect(fakeCrmGateway.createCustomerLead).toHaveBeenCalledTimes(1);
    expect(fakeCrmGateway.createCustomerLead.mock.calls[0][0]).toEqual(customer);
    expect(fakeCrmGateway.createCustomerLead.mock.calls[0][1]).toEqual(salesAgent);
  });
});
