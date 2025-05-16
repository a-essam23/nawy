import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApartmentsService } from './apartments.service';
import { Apartment, ApartmentSchema } from './schemas/apartment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Apartment.name, schema: ApartmentSchema },
    ]),
  ],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
