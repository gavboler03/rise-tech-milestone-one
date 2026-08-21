import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-2",
});

export async function getSecret(secretName: string) {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );

  if (!response.SecretString) {
    throw new Error(`Secret ${secretName} does not contain SecretString`);
  }

  return JSON.parse(response.SecretString);
}
