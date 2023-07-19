import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import GetPowerDistributors from '../../usecase/get-power-distributors';
import SolarEnergyGatewayFactory from '../../factory/solar-energy-gateway-factory';
import { getStage } from '../../config/environment';

import { sendHttpOkResponse, sendHtttpError } from './common-handlers';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const solarEnergyGateway = new SolarEnergyGatewayFactory(getStage()).getSolarEnergyGateway();
    return sendHttpOkResponse(await new GetPowerDistributors(solarEnergyGateway).execute(JSON.stringify(event.pathParameters)));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
