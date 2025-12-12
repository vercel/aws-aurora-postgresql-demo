import { getConnection } from "./db";
import { performance } from "perf_hooks";

export interface Movie {
  id: number;
  title: string;
  score: number;
  lastVoteTime: Date;
  hasVoted: boolean;
}

export interface MoviesResult {
  movies: Movie[];
  totalRecords: number;
  queryTimeMs: string;
}

export async function getMovies(sessionId?: string, filter?: string) {
  const pool = await getConnection();
  const startTime = performance.now();

  const params: any[] = [];
  let whereClause = "";

  if (filter) {
    whereClause = "WHERE m.title ILIKE $1";
    params.push(`%${filter}%`);
  }

  const countQuery = `SELECT COUNT(*) as count FROM movies m ${whereClause}`;
  const countResult = await pool.query(countQuery, params);
  const totalRecords = parseInt(countResult.rows[0]?.count || "0");

  let moviesQuery: string;
  let queryParams: any[];

  if (sessionId) {
    moviesQuery = `
      SELECT 
        m.id, 
        m.title, 
        m.score, 
        m.last_vote_time as "lastVoteTime",
        CASE WHEN v.session_id IS NOT NULL THEN true ELSE false END as "hasVoted"
      FROM movies m
      LEFT JOIN votes v ON v.movie_id = m.id AND v.session_id = $${params.length + 1}::uuid
      ${whereClause}
      ORDER BY m.score DESC
      LIMIT 8
    `;
    queryParams = [...params, sessionId];
  } else {
    moviesQuery = `
      SELECT 
        m.id, 
        m.title, 
        m.score, 
        m.last_vote_time as "lastVoteTime",
        false as "hasVoted"
      FROM movies m
      ${whereClause}
      ORDER BY m.score DESC
      LIMIT 8
    `;
    queryParams = params;
  }

  const result = await pool.query(moviesQuery, queryParams);

  const endTime = performance.now();
  const queryTimeMs = (endTime - startTime).toFixed(2);

  console.log(`Database query took ${queryTimeMs} ms`);

  const data = result.rows.map((movie) => ({
    ...movie,
    lastVoteTime: new Date(movie.lastVoteTime),
    hasVoted: Boolean(movie.hasVoted),
  }));

  return { movies: data, totalRecords, queryTimeMs };
}
