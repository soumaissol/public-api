import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import CalculateSimulation from '../../usecase/calculate-simulation';
import { getStage } from '../../config/environment';
import SolarEnergyGatewayFactory from '../../factory/solar-energy-gateway-factory';

import { sendHttpOkResponse, sendHtttpError } from './common-handlers';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const solarEnergyGateway = new SolarEnergyGatewayFactory(getStage()).getSolarEnergyGateway();

    return sendHttpOkResponse(await new CalculateSimulation(solarEnergyGateway).execute(event.body));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
