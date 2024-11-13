# ShouldReads

## How it came to be
This is a little NLP project I cooked up to help me find books to read based off of a query. I used the [mixedbread-ai/mxbai-embed-xsmall-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-xsmall-v1) to vectorize descriptions of some book from the must read list on Goodreads.

Then I put them into a sqlite file using [sqlite-vec](https://github.com/asg017/sqlite-vec) to turn the sqlite file into a vector db. Then I set up [Hono.js](https://hono.dev) as lightweight backend server that runs a similarity search based on the query and the entries in the vector db.

I also attempted to structure the project based off of the [local-first architecture](https://www.inkandswitch.com/local-first) by using [Transformers.js](https://huggingface.co/docs/transformers.js/v3.0.0/index) to run the mixedbread model and generate embeddings on the client then passing it through.

The project isn't complete and I've dockerized the backend but there is still more work needing to be done to improve security and resilience.

## Tech Used
- [mxbai-embed-xsmall-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-xsmall-v1)
- [sqlite-vec](https://github.com/asg017/sqlite-vec)
- [Hono.js](https://hono.dev)
- [Transformers.js](https://huggingface.co/docs/transformers.js/v3.0.0/index)

### Common Tech
- Docker
- React
- TypeScript
- TailwindCSS
- Vite

## To-Do
- Set up proper cors restrictions
- Deploy the project (backend in a Container Registry and frontend on cloudflare pages.)
- Figure out more features
