import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, sql } from './client'

// MIGRATIONS_DIR dipakai di container production, tempat migrasi disalin di samping bundle.
const migrationsFolder = process.env.MIGRATIONS_DIR ?? `${import.meta.dir}/migrations`

await migrate(db, { migrationsFolder })
console.log('Migrasi selesai')
await sql.end()
