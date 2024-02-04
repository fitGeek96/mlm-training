import { PrismaClient } from '@prisma/client'

let db: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}


try {
  // Your database operations here
  if (process.env.NODE_ENV === 'production') {
    db = new PrismaClient()
    await db.$connect()
  } else {
    if (!global.__db) {
      global.__db = new PrismaClient()
     await global.__db.$connect()
    }
    db = global.__db
  }
  

} catch (error) {
  throw new Error("Error with DB Operation");
} finally {
  await db.$disconnect();
}

export { db }