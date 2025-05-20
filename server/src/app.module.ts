import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApartmentsModule } from './apartments/apartments.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { configurationSchema } from '@config/configuration.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from './file-upload/file-upload.module';
import { RequestLoggerMiddleware } from '@middlewares/request-logger.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: configurationSchema,
      validationOptions: {
        abortEarly: false,
        stripUnknown: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ApartmentsModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
