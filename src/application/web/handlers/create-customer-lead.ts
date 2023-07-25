import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import PipefyCrmGateway from '../../../infra/crm-gateway/pipefy-crm-gateway';
import {
  getPipefyApiUrl,
  getPipefyAuthToken,
  getPipefyCustomerLeadsPipeId,
  getPipefyCustomerTableId,
  getPipefySalesAgentsTableId,
} from '../../config/environment';
import CreateCustomerLead from '../../usecase/create-customer-lead';
import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const crmGateway = new PipefyCrmGateway(
      getPipefyAuthToken(),
      getPipefyApiUrl(),
      getPipefyCustomerTableId(),
      getPipefySalesAgentsTableId(),
      getPipefyCustomerLeadsPipeId(),
    );

    return sendHttpOkResponse(await new CreateCustomerLead(crmGateway).execute(event.body));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
