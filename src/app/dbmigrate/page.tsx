//'use client';
//migration imports
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
import { db } from '@/db/dbstuff';
import { adminRestrict } from '@/servertools';


export default async function Home() {
  await adminRestrict()
    migrate(db, { migrationsFolder: './drizzle' });
    return (
      <div>
        <h1>SECRET DB ADMIN PAGE</h1>
        You've probably migrated the database by coming here. Don't leave this page open while the site is running.
      </div>
    )
  }
  