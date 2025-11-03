import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { closeConnection, getConnection } from './db';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const pool = await getConnection();
  const migrationFile = path.join(process.cwd(), 'lib/db/migrations/0000_adorable_adam_destine.sql');
  const sql = fs.readFileSync(migrationFile, 'utf-8');
  
  console.log('Running migrations...');
  await pool.query(sql);
  console.log('Migrations complete');
  
  await closeConnection();
}

main();
