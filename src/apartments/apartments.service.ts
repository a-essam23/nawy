import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Apartment } from './schemas/apartment.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApartmentsService {
  private readonly logger = new Logger(ApartmentsService.name);
  constructor(
    @InjectModel(Apartment.name) private apartmentModel: Model<Apartment>,
  ) {}
  async findApartmentBySlug(slug: string) {
    const apartment = await this.apartmentModel.findOne({ slug });
    if (!apartment)
      throw new NotFoundException(`Apartment "${slug}" not found`);
    return apartment;
  }
  async findApartmentById(id: string) {
    const apartment = await this.apartmentModel.findById(id);
    if (!apartment)
      throw new NotFoundException(`Apartment with _id "${id}" not found`);
    return apartment;
  }
  async findAll() {
    const apartments = await this.apartmentModel.find({});
    return apartments;
  }
}
