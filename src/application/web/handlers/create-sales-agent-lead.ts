import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import PipefyCrmGateway from '../../../infra/crm-gateway/pipefy-crm-gateway';
import {
  getPipefyApiUrl,
  getPipefyAuthToken,
  getPipefyCustomerLeadsPipeId,
  getPipefyCustomerTableId,
  getPipefySalesAgentLeadsPipeId,
  getPipefySalesAgentsTableId,
} from '../../config/environment';
import CreateSalesAgentLead from '../../usecase/create-sales-agent-lead';
import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const crmGateway = new PipefyCrmGateway(
      getPipefyAuthToken(),
      getPipefyApiUrl(),
      getPipefyCustomerTableId(),
      getPipefySalesAgentsTableId(),
      getPipefyCustomerLeadsPipeId(),
      getPipefySalesAgentLeadsPipeId(),
    );

    return sendHttpOkResponse(await new CreateSalesAgentLead(crmGateway).execute(event.body));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
