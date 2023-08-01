import type Customer from '../../domain/entity/customer';
import type CustomerLead from '../../domain/entity/customer-lead';
import type SalesAgent from '../../domain/entity/sales-agent';
import type SalesAgentLead from '../../domain/entity/sales-agent-lead';

export default interface CrmGateway {
  createSalesAgentLead(salesAgent: SalesAgent): Promise<SalesAgentLead>;
  findSalesAgentLeadBySalesAgent(salesAgent: SalesAgent): Promise<SalesAgentLead | null>;
  createSalesAgent(salesAgent: SalesAgent): Promise<SalesAgent>;
  createCustomerLead(customer: Customer, salesAgent: SalesAgent): Promise<CustomerLead>;
  findCustomerLeadByCustomer(customer: Customer, salesAgent: SalesAgent): Promise<CustomerLead | null>;
  createCustomer(customer: Customer, salesAgent: SalesAgent): Promise<Customer>;
  findCustomerByPhone(phone: string): Promise<Customer | null>;
  findSalesAgentByLicenseId(salesAgentLicenseId: string): Promise<SalesAgent | null>;
}
