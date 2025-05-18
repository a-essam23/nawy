import * as slugUpdater from 'mongoose-slug-updater';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApartmentsService } from './apartments.service';
import { Apartment, ApartmentSchema } from './schemas/apartment.schema';
import { ApartmentSeederService } from './apartments.seeder.service';
import { ApartmentsController } from './apartments.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Apartment.name,
        useFactory() {
          const schema = ApartmentSchema;
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          // schema.plugin(require('mongoose-slug-updater'));
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
