import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

export type Entry = {
  entryId: number;
  userId: number;
  title: string;
  notes: string;
  photoUrl: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "entries"
    order by "entryId";
    `;
    const result = await db.query<Entry>(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!Number.isInteger(+entryId)) {
      throw new ClientError(400, 'entryId needs to be a number');
    }
    const sql = `
      select *
      from "entries"
      where "entryId" = $1;
    `;
    const params = [entryId];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    if (!entry) {
      return res.status(404).json({ error: 'entry not found' });
    }
    res.status(200).json(entry);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    if (!title) {
      throw new ClientError(400, 'Title is missing');
    }
    if (!notes) {
      throw new ClientError(400, 'Notes is missing');
    }
    if (!photoUrl) {
      throw new ClientError(400, 'photoUrl is missing');
    }

    const sql = `
      insert into "entries" ("title", "notes", "photoUrl")
      values ($1, $2, $3)
      returning *;
    `;
    const params = [title, notes, photoUrl];
    const result = await db.query(sql, params);
    const createdEntry = result.rows[0];
    res.status(201).json(createdEntry);
  } catch (err) {
    next(err);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!Number.isInteger(+entryId)) {
      throw new ClientError(400, 'entryId needs to be a number');
    }
    const { title, notes, photoUrl } = req.body;
    if (!title) {
      throw new ClientError(400, 'Title is missing');
    }
    if (!notes) {
      throw new ClientError(400, 'Note is missing');
    }
    if (!photoUrl) {
      throw new ClientError(400, 'PhotoURL is missing');
    }
    const sql = `
      update "entries"
      set "title" = $1, "notes" = $2, "photoUrl" = $3
      where "entryId" = $4
      returning *;
    `;
    const params = [title, notes, photoUrl, entryId];
    const result = await db.query(sql, params);
    const updatedEntry = result.rows[0];
    if (!updatedEntry) {
      throw new ClientError(404, 'Entry not found');
    }
    res.status(200).json(updatedEntry);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!Number.isInteger(+entryId)) {
      throw new ClientError(400, 'entryId needs to be a number');
    }
    const sql = `
      delete from "entries"
      where "entryId" = $1
      returning *;
    `;
    const params = [entryId];
    const result = await db.query(sql, params);
    const deletedEntry = result.rows[0];
    if (!deletedEntry) {
      throw new ClientError(404, 'Entry not found');
    }
    res.status(204).json(deletedEntry);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
