import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildLocaleFromEvent, getStage, sendHttpOkResponse, sendHtttpError } from 'sms-api-commons';

import CustomLocaleProvider from '../../../locale/custom-locale-provider';
import SolarEnergyGatewayFactory from '../../factory/solar-energy-gateway-factory';
import GetPowerDistributors from '../../usecase/get-power-distributors';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const locale = buildLocaleFromEvent(new CustomLocaleProvider(), event);
  try {
    const solarEnergyGateway = new SolarEnergyGatewayFactory(getStage()).getSolarEnergyGateway();
    return sendHttpOkResponse(
      await new GetPowerDistributors(solarEnergyGateway).execute(locale, JSON.stringify(event.pathParameters)),
    );
  } catch (err: any) {
    return sendHtttpError(locale, err);
  }
};
