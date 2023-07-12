import fetch from "node-fetch";

export const getPowerDistributorsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getPowerDistributorsHandler only accept GET method, you tried: ${event.httpMethod}`
    );
  }

  console.info("received:", event);
  const params = event.pathParameters || {};
  if (!params.zip) {
    throw new Error(
      `Path param 'zip' is required. Received, you tried: ${JSON.stringify(
        params
      )}`
    );
  }

  let response = {};

  const result = await fetch(
    `https://www.portalsolar.com.br/api/v1/simulations/power_distributors?postalcode=${params.zip}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  let responseBody = await result.text();
  console.log("Response: " + responseBody);
  try {
    responseBody = JSON.parse(responseBody);
    response.body = JSON.stringify(responseBody);
  } catch (e) {
    console.error("Failed to parse response body", e);
    response.body = "Erro inesperado";
  }

  if (!result.ok) {
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
