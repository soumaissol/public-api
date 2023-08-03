sam deploy \
--profile soumaissolstaging \
--region us-east-1 \
--stack-name public-api \
--no-confirm-changeset \
--disable-rollback \
--resolve-s3 \
--s3-prefix public-api \
--capabilities CAPABILITY_IAM \
--config-file samconfig.toml \
--parameter-overrides ParameterKey=Stage,ParameterValue=staging \
ParameterKey=PipefyAuthToken,ParameterValue=$PIPEFY_AUTH_TOKEN \
ParameterKey=PipefyApiUrl,ParameterValue=https://api.pipefy.com/graphql \
ParameterKey=PipefyCustomersTableId,ParameterValue=303459423 \
ParameterKey=PipefySalesAgentsTableId,ParameterValue=303459424 \
ParameterKey=PipefyCustomerLeadsPipeId,ParameterValue=303451527 \
ParameterKey=PipefySalesAgentLeadsPipeId,ParameterValue=303465808
