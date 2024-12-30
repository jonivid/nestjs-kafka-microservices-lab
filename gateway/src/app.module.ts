import { Module } from '@nestjs/common';

// import { UserService } from './user/user.service';
// import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
