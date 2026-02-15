import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  nodeEnv: process.env.NODE_ENV || 'development',
};

