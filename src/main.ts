import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { MongooseExceptionFilter } from '@common/filters/mongoose-exception.filter';

async function bootstrap() {
  const logger = new ConsoleLogger({
    json: true,
    timestamp: true,
    colors: true,
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') as number;

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new MongooseExceptionFilter());

  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nawy Apartment API')
    .setDescription('Backend API for Nawy Apartment Application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  logger.log(`Application is running on: ${PORT}`, 'Bootstrap');
}

void bootstrap().catch((error: Error) => {
  const logger = new ConsoleLogger('BootstrapError');
  logger.error(
    `Failed to bootstrap application: ${error.message}`,
    error.stack,
  );
  process.exit(1);
});
