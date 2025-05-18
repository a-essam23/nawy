import { Controller, Get, Param } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { Apartment } from './schemas/apartment.schema';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsSerivce: ApartmentsService) {}
  @Get()
  async findAll(): Promise<Apartment[]> {
    const apartments = await this.apartmentsSerivce.findAll();
    return apartments;
  }

  @Get(':slug')
  async findOne(@Param() params: { slug: string }): Promise<Apartment> {
    return this.apartmentsSerivce.findApartmentBySlug(params.slug);
  }
}
