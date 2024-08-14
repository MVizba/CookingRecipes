import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { DataType, newDb } from 'pg-mem'
import * as entities from '../entities'

// same as DataSourceOptions, but allows for 'pg-mem' type
type DatabaseOptions = Partial<DataSourceOptions> | { type: 'pg-mem' }

export function createDatabase(options: DatabaseOptions) {
  // Run with an in-memory database.
  if (options.type === 'pg-mem') {
    return createMemoryDatabase()
  }

  return new DataSource({
    // defaults
    entities,
    migrations: [relative('./migrations/**/*.ts')],
    namingStrategy: new SnakeNamingStrategy(),

    // overrides
    ...options,
  } as any)
}

function createMemoryDatabase(): DataSource {
  const pgMemory = newDb()

  pgMemory.public.registerFunction({
    name: 'current_database',
    implementation: () => 'test',
  })
  pgMemory.public.registerFunction({
    name: 'version',
    implementation: () => '1',
  })
  pgMemory.public.registerFunction({
    name: 'obj_description',
    args: [DataType.text, DataType.text],
    returns: DataType.text,
    implementation: () => 'test',
  })

  return pgMemory.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  })
}

function relative(...paths: string[]) {
  const directory = join(fileURLToPath(import.meta.url), '..')
  return join(directory, ...paths)
}

export type Database = DataSource
