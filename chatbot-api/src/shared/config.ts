import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
}

export const envConfig: EnvConfig = {
  PORT: Number(process.env.PORT) || 4000,
};
