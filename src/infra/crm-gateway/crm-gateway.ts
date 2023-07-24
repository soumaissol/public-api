import SalesAgent from '../../domain/entity/sales-agent';

export default interface CrmGateway {
  findSalesAgent(salesAgentLicenseId: string): Promise<SalesAgent | null>;
}
