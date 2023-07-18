import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import CalculateSimulation from '../../usecase/calculate-simulation';
import FakeSolarEnergyGateway from '../../../infra/solar-energy-gateway/fake-solar-energy-gateway';
import PortalSolarEnergyGateway from '../../../infra/solar-energy-gateway/portal-solar-gateway';

import { sendHttpOkResponse, sendHtttpError } from './common-handlers';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    let solarEnergyGateway = new PortalSolarEnergyGateway();
    if (process.env.NODE_ENV !== 'test') {
      solarEnergyGateway = new FakeSolarEnergyGateway();
    }
    return sendHttpOkResponse({
      message: await new CalculateSimulation(solarEnergyGateway).execute(event.body),
    });
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
