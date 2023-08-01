import type { AxiosRequestHeaders } from 'axios';
import axios from 'axios';
import HttpStatus from 'http-status-codes';

import Customer from '../../domain/entity/customer';
import CustomerLead from '../../domain/entity/customer-lead';
import SalesAgent from '../../domain/entity/sales-agent';
import SalesAgentLead from '../../domain/entity/sales-agent-lead';
import type CrmGateway from './crm-gateway';
import type PipefyCard from './pipefy-crm-model/pipefy-card';
import {
  customerLeadCardDefinitions,
  customerTableDefinitions,
  salesAgentLeadCardDefinitions,
  salesAgentTableDefinitions,
} from './pipefy-crm-model/pipefy-definitions';
import type PipefyEdge from './pipefy-crm-model/pipefy-edge';
import PipefyFieldAttribute from './pipefy-crm-model/pipefy-field-attribute';
import PipefySearchInput from './pipefy-crm-model/pipefy-search-input';
import type PipefyTableRecord from './pipefy-crm-model/pipefy-table-record';

export default class PipefyCrmGateway implements CrmGateway {
  constructor(
    readonly authToken: string,
    readonly apiUrl: string,
    readonly customerTableDefinitionsId: string,
    readonly salesAgentsTableId: string,
    readonly customerLeadsPipeId: string,
    readonly salesAgentLeadsPipeId: string,
  ) {}
  async createSalesAgentLead(salesAgent: SalesAgent): Promise<SalesAgentLead> {
    const cardRecord = await this.createCard(this.salesAgentLeadsPipeId, [
      new PipefyFieldAttribute(salesAgentLeadCardDefinitions.salesAgentFieldId, salesAgent.id!),
    ]);

    return new SalesAgentLead(cardRecord.id, salesAgent);
  }

  async findSalesAgentLeadBySalesAgent(salesAgent: SalesAgent): Promise<SalesAgentLead | null> {
    const pipefySalesAgentLead = await this.findCard(
      this.salesAgentLeadsPipeId,
      new PipefySearchInput(salesAgentLeadCardDefinitions.salesAgentFieldId, salesAgent.id!),
    );
    return pipefySalesAgentLead ? new SalesAgentLead(pipefySalesAgentLead.node.id, salesAgent) : null;
  }

  async createSalesAgent(salesAgent: SalesAgent): Promise<SalesAgent> {
    const tableRecord = await this.createRecord(this.salesAgentsTableId, [
      new PipefyFieldAttribute(salesAgentTableDefinitions.emailFieldId, salesAgent.email),
      new PipefyFieldAttribute(salesAgentTableDefinitions.phoneFieldId, salesAgent.getPhone()),
      new PipefyFieldAttribute(salesAgentTableDefinitions.fullNameFieldId, salesAgent.fullName),
      new PipefyFieldAttribute(salesAgentTableDefinitions.licenseFieldId, salesAgent.licenseId),
      new PipefyFieldAttribute(salesAgentTableDefinitions.agencyIdsFieldId, salesAgent.agencyIds.toString()),
    ]);

    return SalesAgent.buildSalesAgent(salesAgent, tableRecord.id);
  }

  async createCustomerLead(customer: Customer, salesAgent: SalesAgent): Promise<CustomerLead> {
    const cardRecord = await this.createCard(this.customerLeadsPipeId, [
      new PipefyFieldAttribute(customerLeadCardDefinitions.customerFieldId, customer.id!),
      new PipefyFieldAttribute(customerLeadCardDefinitions.salesAgentFieldId, salesAgent.id!),
    ]);

    return new CustomerLead(cardRecord.id, customer, salesAgent);
  }

  async findCustomerLeadByCustomer(customer: Customer, salesAgent: SalesAgent): Promise<CustomerLead | null> {
    const pipefyCustomerLead = await this.findCard(
      this.customerLeadsPipeId,
      new PipefySearchInput(customerLeadCardDefinitions.customerFieldId, customer.id!),
    );
    return pipefyCustomerLead ? new CustomerLead(pipefyCustomerLead.node.id, customer, salesAgent) : null;
  }

  async createCustomer(customer: Customer, salesAgent: SalesAgent): Promise<Customer> {
    const tableRecord = await this.createRecord(this.customerTableDefinitionsId, [
      new PipefyFieldAttribute(customerTableDefinitions.emailFieldId, customer.email),
      new PipefyFieldAttribute(customerTableDefinitions.phoneFieldId, customer.getPhone()),
      new PipefyFieldAttribute(customerTableDefinitions.fullNameFieldId, customer.fullName),
      new PipefyFieldAttribute(customerTableDefinitions.zipFieldId, customer.zip),
      new PipefyFieldAttribute(customerTableDefinitions.energyConsumption, customer.energyConsumption.toString()),
      new PipefyFieldAttribute(customerTableDefinitions.salesAgentFieldId, salesAgent.id!),
    ]);

    return Customer.buildCustomer(customer, tableRecord.id);
  }

  async findCustomerByPhone(phone: string): Promise<Customer | null> {
    const pipefyCustomer = await this.findRecord(
      this.customerTableDefinitionsId,
      new PipefySearchInput(customerTableDefinitions.phoneFieldId, phone),
    );
    return pipefyCustomer
      ? new Customer(
          this.getFieldValue(pipefyCustomer, customerTableDefinitions.phoneFieldId),
          this.getFieldValue(pipefyCustomer, customerTableDefinitions.emailFieldId),
          this.getFieldValue(pipefyCustomer, customerTableDefinitions.fullNameFieldId),
          this.getFieldValue(pipefyCustomer, customerTableDefinitions.zipFieldId),
          this.getFieldValueAsInt(pipefyCustomer, customerTableDefinitions.energyConsumption),
          pipefyCustomer.node.id,
        )
      : null;
  }

  getFieldValueAsInt(edge: PipefyEdge, id: string): number {
    const value = this.getFieldValue(edge, id);
    if (value === '') {
      return 0;
    }
    return parseInt(value, 10);
  }

  getFieldValue(edge: PipefyEdge, id: string): string {
    for (const nodeField of edge.node.fields) {
      if (id === nodeField.field.id) {
        return nodeField.value;
      }
    }
    return '';
  }

  getFieldArrayValue(edge: PipefyEdge, id: string): string[] {
    for (const nodeField of edge.node.fields) {
      if (id === nodeField.field.id) {
        return nodeField.array_value;
      }
    }
    return [];
  }

  async findSalesAgentByLicenseId(salesAgentLicenseId: string): Promise<SalesAgent | null> {
    const pipefySalesAgent = await this.findRecord(
      this.salesAgentsTableId,
      new PipefySearchInput(salesAgentTableDefinitions.licenseFieldId, salesAgentLicenseId),
    );
    return pipefySalesAgent
      ? new SalesAgent(
          this.getFieldValue(pipefySalesAgent, salesAgentTableDefinitions.licenseFieldId),
          this.getFieldValue(pipefySalesAgent, salesAgentTableDefinitions.phoneFieldId),
          this.getFieldValue(pipefySalesAgent, salesAgentTableDefinitions.emailFieldId),
          this.getFieldValue(pipefySalesAgent, salesAgentTableDefinitions.fullNameFieldId),
          this.getFieldArrayValue(pipefySalesAgent, salesAgentTableDefinitions.agencyIdsFieldId),
          pipefySalesAgent.node.id,
        )
      : null;
  }

  async createRecord(tableId: string, fieldAttributes: PipefyFieldAttribute[]): Promise<PipefyTableRecord> {
    const mutation = `
    mutation($tableId:ID!, $fieldAttributes: [FieldValueInput]) {
      createTableRecord(input: {
        table_id: $tableId,
        fields_attributes: $fieldAttributes
      }){
          table_record { id }
      }
    }`;

    const result = await axios.post(
      this.apiUrl,
      JSON.stringify({ query: mutation, variables: { fieldAttributes, tableId } }),
      {
        headers: this.getRequestHeaders(),
      },
    );

    if (result.status !== HttpStatus.OK) {
      throw new Error(`response with error ${result.status}: ${result.data.errors || result.data.message}`);
    }
    if (result.data.errors) {
      throw new Error(`errors data returned: ${JSON.stringify(result.data.errors)}`);
    }

    return result.data.data.createTableRecord.table_record as PipefyTableRecord;
  }

  async findRecord(tableId: string, search: PipefySearchInput): Promise<PipefyEdge | undefined> {
    const query = `query($tableId:String!, $fieldId:String!, $fieldValue:String!){
        findRecords(
          tableId: $tableId
          search: {fieldId:$fieldId,fieldValue:$fieldValue}
        ) {
          edges {
            node {
              id
              fields {
                value
                array_value
                field {
                  id
                }
              }
            }
          }
        }
      }`;
    const result = await axios.post(this.apiUrl, JSON.stringify({ query, variables: { ...search, tableId } }), {
      headers: this.getRequestHeaders(),
    });
    if (result.status !== HttpStatus.OK) {
      throw new Error(`response with error ${result.status}: ${result.data.errors || result.data.message}`);
    }
    if (result.data.errors) {
      throw new Error(`errors data returned: ${JSON.stringify(result.data.errors)}`);
    }

    const edges = result.data.data.findRecords.edges as PipefyEdge[];
    return edges.shift();
  }

  async createCard(pipeId: string, fieldAttributes: PipefyFieldAttribute[]): Promise<PipefyCard> {
    const mutation = `
    mutation($pipeId:ID!, $fieldAttributes: [FieldValueInput]) {
      createCard(input: {
        pipe_id: $pipeId,
        fields_attributes: $fieldAttributes
      }) {
          card { id }
      }
    }`;

    const result = await axios.post(
      this.apiUrl,
      JSON.stringify({ query: mutation, variables: { fieldAttributes, pipeId } }),
      {
        headers: this.getRequestHeaders(),
      },
    );

    if (result.status !== HttpStatus.OK) {
      throw new Error(`response with error ${result.status}: ${result.data.errors || result.data.message}`);
    }
    if (result.data.errors) {
      throw new Error(`errors data returned: ${JSON.stringify(result.data.errors)}`);
    }

    return result.data.data.createCard.card as PipefyCard;
  }

  async findCard(pipeId: string, search: PipefySearchInput): Promise<PipefyEdge | undefined> {
    const query = `query($pipeId:ID!, $fieldId:String!, $fieldValue:String!){
          findCards(pipeId: $pipeId,
            search: {fieldId:$fieldId,fieldValue:$fieldValue}
          ) {
            edges {
              node {
                id
                fields {
                  value
                  field {
                    id
                  }
                }
              }
            }
          }
      }`;
    const result = await axios.post(this.apiUrl, JSON.stringify({ query, variables: { ...search, pipeId } }), {
      headers: this.getRequestHeaders(),
    });
    if (result.status !== HttpStatus.OK) {
      throw new Error(`response with error ${result.status}: ${result.data.errors || result.data.message}`);
    }
    if (result.data.errors) {
      throw new Error(`errors data returned: ${JSON.stringify(result.data.errors)}`);
    }

    const edges = result.data.data.findCards.edges as PipefyEdge[];
    return edges.shift();
  }

  getRequestHeaders(): AxiosRequestHeaders {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }
}
