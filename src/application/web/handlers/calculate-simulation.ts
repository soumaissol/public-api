import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { getStage } from '../../config/environment';
import SolarEnergyGatewayFactory from '../../factory/solar-energy-gateway-factory';
import CalculateSimulation from '../../usecase/calculate-simulation';
import { buildLocaleFromEvent } from '../locale/locale-builder';
import { sendHttpOkResponse, sendHtttpError } from './common-handlers';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const locale = buildLocaleFromEvent(event);

  try {
    const solarEnergyGateway = new SolarEnergyGatewayFactory(getStage()).getSolarEnergyGateway();

    return sendHttpOkResponse(await new CalculateSimulation(solarEnergyGateway).execute(locale, event.body));
  } catch (err: any) {
    return sendHtttpError(locale, err);
  }
};
