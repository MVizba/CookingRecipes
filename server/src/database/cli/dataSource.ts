import config from '@server/config'
import { createDatabase } from '..'

// exclusively for TypeORM migrations cli
export const migrationDatasource = createDatabase(config.database as any)
