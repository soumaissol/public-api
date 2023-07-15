import { object, string, number } from 'yup'
import HttpStatus from 'http-status-codes';
import axios from 'axios';
import { LendingCompany } from '../domain/entity/lending-company'
import Client from '../domain/entity/client'
import { Simulation } from '../domain/entity/simulation'

const schema = object().shape({
  powerDistributorId: number().required(),
  email: string().email('Email inválido').required(),
  energyConsumption: number().min(0.0).required(),
  zip: string().length(8).required(),
});

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const calculateHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(
      `calculateHandler only accepts POST method, you tried: ${event.httpMethod} method.}`
    );
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // Get id and name from the body of the request
  const body = JSON.parse(event.body);

  let data;
  try {
    data = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    console.error('Validation failed', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: error.errors }),
    };
  }

  // Creates a new item, or replaces an old item with a new item
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  let response: any = {};

  const result = await axios.post(
    'https://www.portalsolar.com.br/api/v1/simulations/calculate', {
    simulation: {
      postalcode: data.zip,
      light_bill: data.energyConsumption,
      power_distributor_id: data.powerDistributorId,
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
  );

  console.log('Response: ' + JSON.stringify(result.data));
  try {
    const client = new Client(data.energyConsumption);
    const lendingCompany = new LendingCompany(0.0241);
    const simulation = new Simulation(lendingCompany, client);

    const bestSimulationOption = simulation.simulateLoanForClient(result.data.estimated_cost || 30000);
    response.body = JSON.stringify({
      monthlyLoanInstallmentAmount: bestSimulationOption.fixedMonthlyAmount,
      monthlyLoanInstallments: bestSimulationOption.installments,
      paybackInMonths: bestSimulationOption.paybackInMonths
    });
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