import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';

import * as sqliteVec from "sqlite-vec";
import Database from "better-sqlite3";
import path from 'path';
import { fileURLToPath } from 'url';

const app = new Hono()
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'db/vec_books_mbai.sqlite');
const db = new Database(dbPath);
sqliteVec.load(db);

function serializeF32(data: number[]) {
    const vector = new Float32Array(data);
    const buffer = new ArrayBuffer(vector.length * 4);
    const view = new DataView(buffer);

    vector.forEach((value, index) => {
        view.setFloat32(index * 4, value, true); 
    });

    return new Uint8Array(buffer);
}

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/api/query", async (c)=>{

	const query = await c.req.json()
	const rows = db
		.prepare(
			`
		SELECT
			rowid,
			distance
		FROM book_vectors
		WHERE vec_desc MATCH ?
		ORDER BY distance
		LIMIT 5
		`,
		)
		.all(serializeF32(query));
    console.log(rows)
    const allBooks = rows.map((row:any) => {
      console.log(row.rowid)
      const bookData = db.prepare(
          `
        SELECT
        *
        FROM books
        WHERE vector_id = ?
        `,
        )
        .all(row.rowid);
      return bookData[0]
    })

    

	return c.json(allBooks)
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
