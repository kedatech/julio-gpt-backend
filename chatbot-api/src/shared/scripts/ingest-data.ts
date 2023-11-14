import { run } from './pinecone/ingest-data'

(async () => {
    await run();
    console.log('ingestion complete');
  })();
  