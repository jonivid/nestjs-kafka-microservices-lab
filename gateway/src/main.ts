import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create the Gateway's HTTP server
  const app = await NestFactory.create(AppModule);

  // Add validation for HTTP routes
  app.useGlobalPipes(new ValidationPipe());

  // Start the microservice connection
  await app.startAllMicroservices();

  // Start the HTTP server on port 3000
  await app.listen(3000);
  console.log('Gateway is running at http://localhost:3000');
}
bootstrap();
