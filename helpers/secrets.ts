import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import dotenv from "dotenv";

dotenv.config();

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-2",
});

export async function getTestSecrets() {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: process.env.PLAYWRIGHT_SECRET_NAME,
    }),
  );

  if (!response.SecretString) {
    throw new Error("AWS Secrets Manager secret is empty");
  }

  return JSON.parse(response.SecretString);
}
