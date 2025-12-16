import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { attachDatabasePool } from "@vercel/functions";
import { Signer } from "@aws-sdk/rds-signer";
import { ClientBase, Pool } from "pg";

const signer = new Signer({
  hostname: process.env.PGHOST!,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER!,
  region: process.env.AWS_REGION!,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN!,
    clientConfig: { region: process.env.AWS_REGION! },
  }),
});

const pool = new Pool({
  host: process.env.PGHOST!,
  user: process.env.PGUSER!,
  database: process.env.PGDATABASE || "postgres",
  // The auth token value can be cached for up to 15 minutes (900 seconds) if desired.
  password: () => signer.getAuthToken(),
  port: Number(process.env.PGPORT),
  // Recommended to switch to `true` in production.
  // See https://docs.aws.amazon.com/lambda/latest/dg/services-rds.html#rds-lambda-certificates
  ssl: { rejectUnauthorized: false },
  max: 20,
});
attachDatabasePool(pool);

// Single query transaction.
export async function query(sql: string, args: unknown[]) {
  return pool.query(sql, args);
}

// Use it for multiple queries transaction.
export async function withConnection<T>(
  fn: (client: ClientBase) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
