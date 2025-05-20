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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('apartments') // Added
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsSerivce: ApartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all apartments' }) // Added
  @ApiResponse({
    status: 200,
    description: 'Return all apartments.',
    type: [Apartment],
  }) // Added
  async findAll(
    @Param() filterDto: GetApartmentsFilterDto,
  ): Promise<IGetAllReponse<Apartment>> {
    const apartments = await this.apartmentsSerivce.findAll(filterDto);
    return apartments;
  }

  @Get('listings')
  @ApiOperation({ summary: 'Get all apartment listings' }) // Added
  @ApiResponse({
    status: 200,
    description: 'Return all apartment listings.',
    type: [ApartmentListingDto],
  }) // Added
  async findAllListings(
    @Query() filterDto: GetApartmentsFilterDto,
  ): Promise<IGetAllReponse<ApartmentListingDto>> {
    const apartments = await this.apartmentsSerivce.findAllListings(filterDto);
    return apartments;
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an apartment by slug' }) // Added
  @ApiParam({ name: 'slug', description: 'The slug of the apartment' }) // Added
  @ApiResponse({
    status: 200,
    description: 'Return the apartment.',
    type: Apartment,
  }) // Added
  @ApiResponse({ status: 404, description: 'Apartment not found.' }) // Added
  async findOne(@Param() params: { slug: string }): Promise<Apartment> {
    return this.apartmentsSerivce.findApartmentBySlug(params.slug);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search apartments by text' }) // Added
  @ApiBody({ type: GlobalSearchDto }) // Added
  @ApiResponse({
    status: 200,
    description: 'Return matching apartments.',
    type: [Apartment],
  }) // Added
  async search(@Body() GlobalSearchDto: GlobalSearchDto): Promise<Apartment[]> {
    return await this.apartmentsSerivce.searchByText(GlobalSearchDto);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new apartment' }) // Added
  @ApiConsumes('multipart/form-data') // Added
  @ApiBody({
    // Added
    description: 'Apartment data and images',
    type: CreateApartmentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The apartment has been successfully created.',
    type: Apartment,
  }) // Added
  @ApiResponse({ status: 400, description: 'Bad Request.' }) // Added
  @ApiResponse({ status: 422, description: 'Unprocessable Entity.' }) // Added
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
