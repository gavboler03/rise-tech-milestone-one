#!/bin/bash
set -euo pipefail

REGION="${1:-us-east-2}"
REPOSITORY="${2:-ortu3-playwright-lambda}"
STACK_NAME="${3:-ortu3-playwright-lambda}"
FUNCTION_NAME="${4:-ortu3-playwright-lambda}"

TAG=$(date +%Y%m%d%H%M%S)

echo "Resolving AWS account..."
ACCOUNT_ID=$(aws sts get-caller-identity \
    --query Account \
    --output text)

if [ -z "${ACCOUNT_ID}" ]; then
    echo "Unable to determine AWS account ID."
    exit 1
fi

ECR_HOST="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
IMAGE_URI="${ECR_HOST}/${REPOSITORY}:${TAG}"

echo
echo "Configuration"
echo "============="
echo "Account:    ${ACCOUNT_ID}"
echo "Region:     ${REGION}"
echo "Repository: ${REPOSITORY}"
echo "Stack:      ${STACK_NAME}"
echo "Function:   ${FUNCTION_NAME}"
echo "Image:      ${IMAGE_URI}"
echo

echo "Checking ECR repository..."

if ! aws ecr describe-repositories \
    --repository-names "${REPOSITORY}" \
    --region "${REGION}" \
    >/dev/null 2>&1; then

    echo "Creating ECR repository: ${REPOSITORY}"

    aws ecr create-repository \
        --repository-name "${REPOSITORY}" \
        --region "${REGION}" \
        >/dev/null
else
    echo "ECR repository already exists."
fi

echo "Logging into ECR..."

aws ecr get-login-password \
    --region "${REGION}" |
docker login \
    --username AWS \
    --password-stdin "${ECR_HOST}"

echo "Building image..."

docker build \
    --platform linux/amd64 \
    -t "${REPOSITORY}:${TAG}" \
    .

echo "Tagging image..."

docker tag \
    "${REPOSITORY}:${TAG}" \
    "${IMAGE_URI}"

echo "Pushing image..."

docker push "${IMAGE_URI}"

echo "Deploying CloudFormation..."

aws cloudformation deploy \
    --template-file ortu3-playwright-lambda.yaml \
    --stack-name "${STACK_NAME}" \
    --parameter-overrides \
        ImageUri="${IMAGE_URI}" \
        FunctionName="${FUNCTION_NAME}" \
        SecretArn="arn:aws:secretsmanager:us-east-2:695313591406:secret:secrets/playwright/ortu3_admin-jb7KQL" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "${REGION}"

echo
echo "Deployment complete"
echo "==================="
echo "Image:"
echo "${IMAGE_URI}"
echo
echo "Invoke with:"
echo
echo "aws lambda invoke \\"
echo "    --function-name ${FUNCTION_NAME} \\"
echo "    --region ${REGION} \\"
echo "    response.json"
echo
echo "cat response.json"
