import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  OPENAI_API_KEY: string;
  PINECONE_API_KEY: string;
  PINECONE_ENVIRONMENT: string;
  PINECONE_INDEX_NAME: string;
}

export const envConfig: EnvConfig = {
  PORT: Number(process.env.PORT) || 4000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT || '',
  PINECONE_INDEX_NAME:  process.env.PINECONE_INDEX_NAME || ''
};
