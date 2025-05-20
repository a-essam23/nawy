import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { Apartment } from './schemas/apartment.schema';
import { GetApartmentsFilterDto } from './dto/get-apartments-filter.dto';
import { IGetAllReponse } from '@ctypes/index';
import { ApartmentListingDto } from './dto/apartment-listing.dto';
import { CreateApartmentDto } from './dto/create-apartment-dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import GlobalSearchDto from './dto/global-text-search';

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

  @Post('search')
  async search(@Body() GlobalSearchDto: GlobalSearchDto): Promise<Apartment[]> {
    return await this.apartmentsSerivce.searchByText(GlobalSearchDto);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createApartmentDto: CreateApartmentDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg|webp)',
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 }) // 5mb
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    images: Array<Express.Multer.File>,
  ): Promise<Apartment> {
    return await this.apartmentsSerivce.create(createApartmentDto, images);
  }
}
