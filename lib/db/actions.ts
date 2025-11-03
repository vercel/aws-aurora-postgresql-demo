'use server';

import { Movie } from '@/lib/db/queries';
import { getConnection } from './db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function voteAction(
  movie: Movie,
  score: number,
  lastVoteTime: Date,
) {
  const pool = await getConnection();
  const cookieStore = await cookies();

  let sessionId: string | undefined = cookieStore.get('sessionId')?.value;
  
  // Verify session exists in database or create new one
  if (sessionId) {
    const sessionCheck = await pool.query(
      'SELECT id FROM sessions WHERE id = $1::uuid LIMIT 1',
      [sessionId]
    );
    if (sessionCheck.rows.length === 0) {
      sessionId = undefined;
    }
  }
  
  if (!sessionId) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const result = await pool.query(
      'INSERT INTO sessions (expires_at) VALUES ($1) RETURNING id',
      [expiresAt]
    );

    const newSessionId: string = result.rows[0].id;
    sessionId = newSessionId;
    cookieStore.set('sessionId', newSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  const existingVote = await pool.query(
    'SELECT id FROM votes WHERE session_id = $1 AND movie_id = $2 LIMIT 1',
    [sessionId, movie.id]
  );

  if (existingVote.rows.length > 0) {
    return movie;
  }

  const movieExists = await pool.query(
    'SELECT id FROM movies WHERE id = $1 LIMIT 1',
    [movie.id]
  );

  if (movieExists.rows.length === 0) {
    throw new Error('Movie not found');
  }

  await pool.query(
    'INSERT INTO votes (session_id, movie_id) VALUES ($1, $2)',
    [sessionId, movie.id]
  );

  await pool.query(
    'UPDATE movies SET score = $1, last_vote_time = $2 WHERE id = $3',
    [score, lastVoteTime, movie.id]
  );

  revalidatePath('/');
}
