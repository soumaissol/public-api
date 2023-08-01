enum Stage {
  Staging = 'staging',
  Production = 'production',
}

const getStage = (): Stage => {
  return process.env.STAGE as Stage;
};

const isProduction = (): boolean => {
  return getStage() === Stage.Production;
};

const getPipefyAuthToken = (): Stage => {
  return process.env.PIPEFY_AUTH_TOKEN as Stage;
};

const getPipefyApiUrl = (): Stage => {
  return process.env.PIPEFY_API_URL as Stage;
};

const getPipefyCustomerTableId = (): Stage => {
  return process.env.PIPEFY_CUSTOMERS_TABLE_ID as Stage;
};

const getPipefySalesAgentsTableId = (): Stage => {
  return process.env.PIPEFY_SALES_AGENTS_TABLE_ID as Stage;
};

const getPipefyCustomerLeadsPipeId = (): Stage => {
  return process.env.PIPEFY_CUSTOMER_LEADS_PIPE_ID as Stage;
};

const getPipefySalesAgentLeadsPipeId = (): Stage => {
  return process.env.PIPEFY_SALES_AGENT_LEADS_PIPE_ID as Stage;
};

export {
  getPipefyApiUrl,
  getPipefyAuthToken,
  getPipefyCustomerLeadsPipeId,
  getPipefyCustomerTableId,
  getPipefySalesAgentLeadsPipeId,
  getPipefySalesAgentsTableId,
  getStage,
  isProduction,
  Stage,
};
