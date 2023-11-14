import { envConfig } from './env'
/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */

if (!envConfig.PINECONE_INDEX_NAME) {
    throw new Error('Missing Pinecone index name in .env file');
}
