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
import CreateCustomerLead from '../../usecase/create-customer-lead';
import { buildLocaleFromEvent } from '../locale/locale-builder';
import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const locale = buildLocaleFromEvent(event);

  try {
    const crmGateway = new PipefyCrmGateway(
      getPipefyAuthToken(),
      getPipefyApiUrl(),
      getPipefyCustomerTableId(),
      getPipefySalesAgentsTableId(),
      getPipefyCustomerLeadsPipeId(),
      getPipefySalesAgentLeadsPipeId(),
    );

    return sendHttpOkResponse(await new CreateCustomerLead(crmGateway).execute(locale, event.body));
  } catch (err: any) {
    return sendHtttpError(locale, err);
  }
};
