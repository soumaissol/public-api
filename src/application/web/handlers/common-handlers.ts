import HttpStatus from 'http-status-codes';
import { APIGatewayProxyResult } from 'aws-lambda';

import Logger from '../../logger/logger';
import InvalidInput from '../../errors/invalid-input';


const defaultHeaders = (): any => {
  return {
    'Access-Control-Allow-Headers': 'Content-Type,Accept', // eslint-disable-line @typescript-eslint/naming-convention
    'Access-Control-Allow-Origin': '*', // eslint-disable-line @typescript-eslint/naming-convention
    'Access-Control-Allow-Methods': '*', // eslint-disable-line @typescript-eslint/naming-convention
  };
};

const sendHttpOkResponse = (data: any): APIGatewayProxyResult => {
  return {
    statusCode: HttpStatus.OK,
    body: JSON.stringify(data),
    headers: defaultHeaders(),
  };
};

const sendHtttpError = (err: any): APIGatewayProxyResult => {
  const logger = Logger.get();
  logger.error(`catch error ${JSON.stringify(err)}`);

  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let body = JSON.stringify(err?.message || 'Unknow error');

  if (err instanceof InvalidInput) {
    body = JSON.stringify(err);
    statusCode = HttpStatus.BAD_REQUEST;
  }

  return { statusCode, body, headers: defaultHeaders() };
};

export { sendHttpOkResponse, sendHtttpError };
