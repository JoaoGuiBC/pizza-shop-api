import type { Config } from 'drizzle-kit'

import { env } from './src/env'

export default {
  driver: 'pg',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config
