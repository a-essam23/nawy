import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { Apartment } from './schemas/apartment.schema';
import { GetApartmentsFilterDto } from './dto/get-apartments-filter.dto';
import { IGetAllReponse } from '@ctypes/index';
import { ApartmentListingDto } from './dto/apartment-listing.dto';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsSerivce: ApartmentsService) {}

  @Get()
  async findAll(
    @Param() filterDto: GetApartmentsFilterDto,
  ): Promise<IGetAllReponse<Apartment>> {
    const apartments = await this.apartmentsSerivce.findAll(filterDto);
    return apartments;
  }

  @Get('listings')
  async findAllListings(
    @Query() filterDto: GetApartmentsFilterDto,
  ): Promise<IGetAllReponse<ApartmentListingDto>> {
    const apartments = await this.apartmentsSerivce.findAllListings(filterDto);
    return apartments;
  }

  @Get(':slug')
  async findOne(@Param() params: { slug: string }): Promise<Apartment> {
    return this.apartmentsSerivce.findApartmentBySlug(params.slug);
  }
}
