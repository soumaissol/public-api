import HttpStatus from 'http-status-codes';
import { APIGatewayProxyResult } from 'aws-lambda';

import Logger from '../../logger/logger';
import InvalidInput from '../../errors/invalid-input';

const sendHttpOkResponse = (data: any): APIGatewayProxyResult => {
  return {
    statusCode: HttpStatus.OK,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type,Accept', // eslint-disable-line @typescript-eslint/naming-convention
      'Access-Control-Allow-Origin': '*', // eslint-disable-line @typescript-eslint/naming-convention
      'Access-Control-Allow-Methods': '*', // eslint-disable-line @typescript-eslint/naming-convention
    },
  };
};

const sendHtttpError = (err: any): APIGatewayProxyResult => {
  const logger = Logger.get();
  logger.error(`catch error ${JSON.stringify(err)}`);

  if (err instanceof InvalidInput) {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      body: JSON.stringify(err),
    };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    body: JSON.stringify(err.message || 'Unknow error'),
  };
};

export { sendHttpOkResponse, sendHtttpError };
