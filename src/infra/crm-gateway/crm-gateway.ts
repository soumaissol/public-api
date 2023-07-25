import type Customer from '../../domain/entity/customer';
import type CustomerLead from '../../domain/entity/customer-lead';
import type SalesAgent from '../../domain/entity/sales-agent';

export default interface CrmGateway {
  createCustomerLead(customer: Customer, salesAgent: SalesAgent): Promise<CustomerLead>;
  findCustomerLeadByCustomer(customer: Customer, salesAgent: SalesAgent): Promise<CustomerLead | null>;
  createCustomer(customer: Customer, salesAgent: SalesAgent): Promise<Customer>;
  findCustomerByPhone(phone: string): Promise<Customer | null>;
  findSalesAgentBytLicenseId(salesAgentLicenseId: string): Promise<SalesAgent | null>;
}
