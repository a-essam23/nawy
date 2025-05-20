import * as slugUpdater from 'mongoose-slug-updater';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApartmentsService } from './apartments.service';
import { Apartment, ApartmentSchema } from './schemas/apartment.schema';
import { ApartmentSeederService } from './apartments.seeder.service';
import { ApartmentsController } from './apartments.controller';
import { FileUploadModule } from '@/file-upload/file-upload.module';

@Module({
  imports: [
    FileUploadModule,
    MongooseModule.forFeatureAsync([
      {
        name: Apartment.name,
        useFactory() {
          const schema = ApartmentSchema;
          schema.plugin(slugUpdater);
          return schema;
        },
      },
    ]),
  ],
  providers: [ApartmentsService, ApartmentSeederService],
  controllers: [ApartmentsController],
})
export class ApartmentsModule {}
