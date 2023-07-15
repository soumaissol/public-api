import HttpStatus from 'http-status-codes';
import axios from 'axios';

export const getPowerDistributorsHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getPowerDistributorsHandler only accept GET method, you tried: ${event.httpMethod}`
    );
  }

  console.info('received:', event);
  const params = event.pathParameters || {};
  if (!params.zip) {
    throw new Error(
      `Path param 'zip' is required. Received, you tried: ${JSON.stringify(
        params
      )}`
    );
  }

  let response: any = {};

  const result = await axios.get(
    `https://www.portalsolar.com.br/api/v1/simulations/power_distributors?postalcode=${params.zip}`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  console.log('Response: ' + JSON.stringify(result.data));
  try {
    response.body = JSON.stringify(result.data);
  } catch (e) {
    console.error('Failed to parse response body', e);
    response.body = 'Erro inesperado';
  }

  if (result.status !== HttpStatus.OK) {
    response.statusCode = result.status || 500;
  } else {
    response.statusCode = 200;
  }

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
