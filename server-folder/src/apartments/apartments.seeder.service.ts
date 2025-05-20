import mockData from '@/mock';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Apartment,
  GeoJsonPoint,
  IApartmentDocument,
} from './schemas/apartment.schema';

@Injectable()
export class ApartmentSeederService implements OnModuleInit {
  private readonly logger = new Logger(ApartmentSeederService.name);
  private isLoaded = false;
  constructor(
    @InjectModel(Apartment.name)
    private readonly apartmentModel: Model<IApartmentDocument>,
  ) {}

  async onModuleInit() {
    if (this.isLoaded) return;
    await this.seedApartments();
  }

  private async seedApartments() {
    this.logger.log('Starting apartment seeding process...');
    try {
      this.logger.log(`Found ${mockData.length} apartments in mock data.`);

      let createdCount = 0;
      for (const mockApt of mockData) {
        const unitNumber = mockApt.id;
        const slug = `${mockApt.compound?.developer?.name.trim().toLowerCase().replaceAll(' ', '-')}-${mockApt.compound?.name.trim().toLocaleLowerCase().replaceAll(' ', '-')}-${unitNumber}`;
        const name = `${mockApt.compound?.developer?.name} ${mockApt.compound?.name} ${unitNumber}`;
        const existingApartment = await this.apartmentModel.findOne({
          slug,
        });

        if (existingApartment) {
          // this.logger.debug(`Apartment ${name} already exists. Skipping.`);
          continue;
        }

        let price = 0;
        if (mockApt.payment_plan && mockApt.payment_plan.price) {
          price = mockApt.payment_plan.price;
        } else if (mockApt.min_price) {
          price = mockApt.min_price;
        }

        const area = mockApt.max_unit_area;

        const bedrooms = mockApt.number_of_bedrooms || 0;
        const bathrooms = mockApt.number_of_bathrooms || 0;

        const project = mockApt.compound?.name;
        const developer = mockApt.compound?.developer?.name;
        let address = 'Address not specified';
        if (mockApt.compound?.area) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          address = `${mockApt.compound.area.name}${(mockApt.compound.area as any)?.parent_area ? ', ' + (mockApt.compound.area as any).parent_area.name : ''}`;
        }

        const location: GeoJsonPoint | undefined =
          mockApt.compound?.lat && mockApt.compound?.long
            ? {
                type: 'Point',
                coordinates: [mockApt.compound.long, mockApt.compound.lat] as [
                  number,
                  number,
                ],
              }
            : undefined;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        const images = mockApt.images?.map((img: any) => img?.image_path) || [];
        const coverImage =
          mockApt.images?.find((img) => img.cover_photo)?.image.url ||
          images[0] ||
          undefined;

        const apartmentToCreate: Partial<Apartment> = {
          unitNumber: mockApt.id.toString(),
          name: name,
          description: mockApt.one_line_description,
          address: address,
          price: price,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          area: area,
          project: project,
          developer: developer,
          location: location,
          coverImage: coverImage,
          images: images,
        };
        await this.apartmentModel.create(apartmentToCreate);
        createdCount++;
      }

      if (createdCount > 0) {
        this.logger.log(`Successfully seeded ${createdCount} new apartments.`);
      } else {
        this.logger.log(
          'No new apartments to seed. Database up-to-date with mock data.',
        );
      }
    } catch (error) {
      this.logger.error('Error during apartment seeding:', error);
    }
    this.logger.log('Apartment seeding process finished.');
    this.isLoaded = true;
  }
}
