import { Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        return client.db(process.env.DB_NAME);
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
