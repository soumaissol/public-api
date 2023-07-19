import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import FakeSolarEnergyGateway from '../../../infra/solar-energy-gateway/fake-solar-energy-gateway';
import PortalSolarEnergyGateway from '../../../infra/solar-energy-gateway/portal-solar-gateway';
import GetPowerDistributors from '../../usecase/get-power-distributors';

import { sendHttpOkResponse, sendHtttpError } from './common-handlers';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    let solarEnergyGateway = new PortalSolarEnergyGateway();
    if (process.env.NODE_ENV !== 'test') {
      solarEnergyGateway = new FakeSolarEnergyGateway();
    }
    return sendHttpOkResponse(await new GetPowerDistributors(solarEnergyGateway).execute(JSON.stringify(event.pathParameters)));
  } catch (err: any) {
    return sendHtttpError(err);
  }
};
