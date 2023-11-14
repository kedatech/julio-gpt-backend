import { deleteIndex } from './pinecone/indexes-scripts'

(async () => {
    await deleteIndex();
    console.log('Operación completa');
  })();
  