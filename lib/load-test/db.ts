import { Pool } from "pg";
import { getToken } from "./local-token";
import * as dotenv from "dotenv";
import type { Movie } from "../db/queries";
dotenv.config({ path: ".env.local" });

let cachedPool: Pool | null = null;

export async function getPool(): Promise<Pool> {
  if (cachedPool) {
    return cachedPool;
  }

  const token = await getToken();

  cachedPool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE || "postgres",
    password: token,
    port: Number(process.env.PGPORT),
    ssl: { rejectUnauthorized: false },
  });

  return cachedPool;
}


export async function queryMovies(): Promise<Movie[]> {
  const pool = await getPool();

  const movies = await pool.query<Movie>("SELECT id, title, score FROM movies ORDER BY score DESC LIMIT 5");
  return movies.rows.map((movie) => ({
    id: movie.id,
    title: movie.title,
    score: movie.score,
    lastVoteTime: new Date(movie.lastVoteTime),
    hasVoted: false,
  }));
}

export async function writeMovie(title: string, score: number) {
  // PostgreSQL integer max is 2,147,483,647. Use range 1M - 2B to avoid conflicts.
  const id = Math.floor(Math.random() * 2000000000) + 1000000;
  const pool = await getPool();
  await pool.query(
    "INSERT INTO movies (id, title, score, last_vote_time) VALUES ($1, $2, $3, $4)",
    [id, `[LOAD TEST]: ${title}`, score, new Date().toISOString()]
  );
}

export async function deleteMovies() {
  // Delete all movies that start with [LOAD TEST]:
  const pool = await getPool();
  await pool.query(
    "DELETE FROM movies WHERE title LIKE '[LOAD TEST]: %'",
  );
}