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

const getPipefyAuthToken = (): string => {
  return process.env.PIPEFY_AUTH_TOKEN || '';
};

const getPipefyApiUrl = (): string => {
  return process.env.PIPEFY_API_URL || '';
};

const getPipefyCustomerTableId = (): string => {
  return process.env.PIPEFY_CUSTOMERS_TABLE_ID || '';
};

const getPipefySalesAgentsTableId = (): string => {
  return process.env.PIPEFY_SALES_AGENTS_TABLE_ID || '';
};

const getPipefyCustomerLeadsPipeId = (): string => {
  return process.env.PIPEFY_CUSTOMER_LEADS_PIPE_ID || '';
};

const getPipefySalesAgentLeadsPipeId = (): string => {
  return process.env.PIPEFY_SALES_AGENT_LEADS_PIPE_ID || '';
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
