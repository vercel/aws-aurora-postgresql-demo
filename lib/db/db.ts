import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { Signer } from '@aws-sdk/rds-signer';
import { Pool } from 'pg';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

let pool: Pool | null = null;
let cachedToken: { token: string; expiresAt: Date } | null = null;

export async function getToken() {
  const now = new Date();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const signer = new Signer({
    hostname: process.env.PGHOST!,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER!,
    region: process.env.AWS_REGION!,
    credentials: awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN!,
    }),
  });

  const token = await signer.getAuthToken();

  // Token is valid for 15 minutes; set to 14 minutes to be safe
  const expiresAt = new Date(now.getTime() + 14 * 60 * 1000);
  cachedToken = { token, expiresAt };

  return token;
}

export async function getConnection(): Promise<Pool> {
  const now = new Date();

  // Check if pool exists and token is still valid
  if (pool && cachedToken && cachedToken.expiresAt > now) {
    return pool;
  }

  // Token is expired or pool is null, recreate pool
  try {
    if (pool) {
      // Close the existing pool
      await pool.end();
      pool = null;
    }

    const token = await getToken();

    pool = new Pool({
      host: process.env.PGHOST!,
      user: process.env.PGUSER!,
      password: token,
      database: 'postgres',
      port: Number(process.env.PGPORT),
      ssl: { rejectUnauthorized: false },
      max: 20,
    });
    return pool;
  } catch (error) {
    console.error('Failed to create database connection:', error);
    throw error;
  }
}

export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
