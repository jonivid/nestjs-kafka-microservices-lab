import { Module } from '@nestjs/common';
// import { UserController } from './user/user.controller';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
// import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, // Enable ValidationPipe globally
    },
  ],
})
export class AppModule {}
