/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Apartment,
  IApartment,
  IApartmentDocument,
} from './schemas/apartment.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetApartmentsFilterDto } from './dto/get-apartments-filter.dto';
import { ApartmentListingDto } from './dto/apartment-listing.dto';
import { IGetAllReponse } from '@ctypes/index';
import { CreateApartmentDto } from './dto/create-apartment-dto';
import { FileUploadService } from '@/file-upload/file-upload.service';

@Injectable()
export class ApartmentsService {
  private readonly logger = new Logger(ApartmentsService.name);
  constructor(
    @InjectModel(Apartment.name) private apartmentModel: Model<IApartment>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private _buildFilterQuery(
    filterDto: GetApartmentsFilterDto,
  ): FilterQuery<IApartmentDocument> {
    const {
      searchTerm,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minArea,
      maxArea,
      project,
      developer,
      sortBy,
      sortOrder,
    } = filterDto;
    const query: FilterQuery<IApartmentDocument> = {}; // Mongoose query object
    if (searchTerm) {
      // Using the text index defined in your schema
      query.$text = { $search: searchTerm };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (minBedrooms !== undefined || maxBedrooms !== undefined) {
      query.bedrooms = {};
      if (minBedrooms !== undefined) query.bedrooms.$gte = minBedrooms;
      if (maxBedrooms !== undefined) query.bedrooms.$lte = maxBedrooms;
    }

    if (minBathrooms !== undefined || maxBathrooms !== undefined) {
      query.bathrooms = {};
      if (minBathrooms !== undefined) query.bathrooms.$gte = minBathrooms;
      if (maxBathrooms !== undefined) query.bathrooms.$lte = maxBathrooms;
    }

    if (minArea !== undefined || maxArea !== undefined) {
      query.area = {};
      if (minArea !== undefined) query.area.$gte = minArea;
      if (maxArea !== undefined) query.area.$lte = maxArea;
    }

    if (project) {
      // Case-insensitive partial match for project name
      query.project = { $regex: new RegExp(project, 'i') };
    }

    if (developer) {
      // Case-insensitive partial match for developer name
      query.developer = { $regex: new RegExp(developer, 'i') };
    }
    // If using array filters for projects/developers:
    // if (filterDto.projects && filterDto.projects.length > 0) {
    //   query.project = { $in: filterDto.projects.map(p => new RegExp(p, 'i')) }; // case-insensitive match for each
    // }
    // if (filterDto.developers && filterDto.developers.length > 0) {
    //   query.developer = { $in: filterDto.developers.map(d => new RegExp(d, 'i')) };
    // }
    const sortOptions: { [key: string]: 'asc' | 'desc' | 1 | -1 } = {};
    if (sortBy && sortOrder) {
      sortOptions[sortBy] = sortOrder;
    } else if (sortBy) {
      sortOptions[sortBy] = 'asc'; // Default sort order if only sortBy is provided
    } else if (searchTerm) {
      // If searching by text, MongoDB adds a 'textScore' field for relevance.
      // You can sort by it to get most relevant results first.
      // This requires projecting the textScore.
      // queryBuilder = queryBuilder.select({ score: { $meta: 'textScore' } });
      // sortOptions = { score: { $meta: 'textScore' } };
      // For now, let's keep it simple; text search results order might be good enough by default
    }
    return query;
  }

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

  async findAll(filterDto: GetApartmentsFilterDto) {
    const { page = 1, limit = 10, sortBy, sortOrder } = filterDto;
    const sortOptions: { [key: string]: 'asc' | 'desc' | 1 | -1 } = {};
    if (sortBy && sortOrder) {
      sortOptions[sortBy] = sortOrder;
    } else if (sortBy) {
      sortOptions[sortBy] = 'asc';
    }

    const query = this._buildFilterQuery(filterDto);
    const skip = (page - 1) * limit;

    const apartments = await this.apartmentModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.apartmentModel.countDocuments(query).exec();
    return {
      data: apartments,
      total,
      page,
      limit,
    };
  }

  async findAllListings(
    filterDto: GetApartmentsFilterDto,
  ): Promise<IGetAllReponse<ApartmentListingDto>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = filterDto;
    const sortOptions: { [key: string]: 'asc' | 'desc' | 1 | -1 } = {};
    if (sortBy && sortOrder) {
      sortOptions[sortBy] = sortOrder;
    } else if (sortBy) {
      sortOptions[sortBy] = 'asc';
    }

    const query = this._buildFilterQuery(filterDto);
    const skip = (page - 1) * limit;
    const select = [
      '_id',
      'name',
      'slug',
      'price',
      'bedrooms',
      'bathrooms',
      'area',
      'project',
      'developer',
      'coverImage',
      'address',
    ];
    const [apartments, total] = await Promise.all([
      this.apartmentModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select(select)
        .exec(),
      this.apartmentModel.countDocuments(query).exec(),
    ]);

    return {
      data: apartments as any,
      total,
      page,
      limit,
    };
  }

  async create(
    createApartmentDto: CreateApartmentDto,
    images: Array<Express.Multer.File>,
  ): Promise<IApartmentDocument> {
    if (!images || images.length === 0) {
      throw new BadRequestException('No images provided.');
    }
    const location = createApartmentDto.location
      ? {
          type: 'Point',
          coordinates: [
            createApartmentDto.location.longitude,
            createApartmentDto.location.latitude,
          ],
        }
      : undefined;
    const newApartment = await this.apartmentModel.create({
      name: createApartmentDto.name,
      description: createApartmentDto.description,
      price: createApartmentDto.price,
      bedrooms: createApartmentDto.bedrooms,
      bathrooms: createApartmentDto.bathrooms,
      area: createApartmentDto.area,
      project: createApartmentDto.project,
      developer: createApartmentDto.developer,
      address: createApartmentDto.address,
      unitNumber: createApartmentDto.unitNumber,
      coverImage: '/placeholder.svg',
      location,
    });
    const apartmentId = newApartment._id.toString();
    this.logger.debug(`Created apartment with _id: ${apartmentId}`);
    this.logger.debug(
      `Uploading ${images.length} images for apartment with _id: ${apartmentId}`,
    );
    const uploadedImages =
      await this.fileUploadService.bulkUploadImages(images);
    console.log(uploadedImages);
    if (uploadedImages) {
      newApartment.coverImage =
        uploadedImages[createApartmentDto.coverIndex].url!;
      newApartment.images = uploadedImages.map((v) => v.url!);
      await newApartment.save();
    } else {
      this.logger.error(
        `Failed to upload images for apartment with _id: ${apartmentId}`,
      );
    }

    return newApartment;
  }

  async searchByText({
    limit = 10,
    text,
  }: {
    text: string;
    limit?: number;
  }): Promise<IApartmentDocument[]> {
    if (!text || text.trim() === '') return [];

    this.logger.log(`Weighted text search for: "${text}", limit: ${limit}`);
    const results: IApartmentDocument[] = [];
    const foundIds = new Set<string>();

    const addUniqueResults = (newResults: IApartmentDocument[]) => {
      for (const doc of newResults) {
        const docId: string = (doc._id as any).toString();
        if (results.length < limit && !foundIds.has(docId)) {
          results.push(doc);
          foundIds.add(docId);
        }
        if (results.length >= limit) break;
      }
    };

    this.logger.log(`Performing weighted text index search for: "${text}"`);
    const textSearchResults = await this.apartmentModel
      .find(
        {
          $text: { $search: text },
        },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } }) // Sort by relevance score (honors weights)
      .limit(limit)
      .exec();
    addUniqueResults(textSearchResults);
    console.log(results);
    return results;
  }
}
