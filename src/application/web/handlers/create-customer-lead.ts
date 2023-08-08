import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildLocaleFromEvent, sendHttpOkResponse, sendHtttpError } from 'sms-api-commons';

import PipefyCrmGateway from '../../../infra/crm-gateway/pipefy-crm-gateway';
import CustomLocaleProvider from '../../../locale/custom-locale-provider';
import {
  getPipefyApiUrl,
  getPipefyAuthToken,
  getPipefyCustomerLeadsPipeId,
  getPipefyCustomerTableId,
  getPipefySalesAgentLeadsPipeId,
  getPipefySalesAgentsTableId,
} from '../../config/environment';
import CreateCustomerLead from '../../usecase/create-customer-lead';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const locale = buildLocaleFromEvent(new CustomLocaleProvider(), event);

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
