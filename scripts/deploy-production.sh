sam deploy \
--profile soumaissol \
--region us-east-1 \
--stack-name public-api \
--no-confirm-changeset \
--disable-rollback \
--resolve-s3 \
--s3-prefix public-api \
--capabilities CAPABILITY_IAM \
--config-file samconfig.toml \
--parameter-overrides ParameterKey=Stage,ParameterValue=production \
ParameterKey=PipefyAuthToken,ParameterValue=$PIPEFY_AUTH_TOKEN \
ParameterKey=PipefyApiUrl,ParameterValue=https://api.pipefy.com/graphql \
ParameterKey=PipefyCustomersTableId,ParameterValue=303176300 \
ParameterKey=PipefySalesAgentsTableId,ParameterValue=303176301 \
ParameterKey=PipefyCustomerLeadsPipeId,ParameterValue=303176290 \
ParameterKey=PipefySalesAgentLeadsPipeId,ParameterValue=303466055
