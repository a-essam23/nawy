// src/apartments/dto/create-apartment.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  ValidateNested,
  IsLongitude,
  IsLatitude,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer'; // For nested DTO validation
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Added

class LocationInputDto {
  @ApiProperty({ example: 30.0444, description: 'Latitude of the location' }) // Added
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  @ApiProperty({ example: 31.2357, description: 'Longitude of the location' }) // Added
  @IsNotEmpty()
  longitude: number;
}

export class CreateApartmentDto {
  @ApiProperty({
    example: 'Luxury Apartment with Nile View',
    description: 'Name of the apartment',
    minLength: 3,
    maxLength: 255,
  }) // Added
  @IsNotEmpty({ message: 'Apartment name is required.' })
  @IsString()
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters.' })
  name: string;

  @IsNotEmpty({ message: 'Description is required.' })
  @IsString()
  @Length(10, 5000, {
    message: 'Description must be between 10 and 5000 characters.',
  })
  description: string;

  @IsNotEmpty({ message: 'Address is required.' })
  @IsString()
  @ApiProperty({
    example: '123 Nile Corniche, Garden City, Cairo',
    description: 'Full address of the apartment',
  }) // Added
  @IsNotEmpty({ message: 'Address is required.' })
  address: string;

  @IsNotEmpty({ message: 'Price is required.' })
  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  @ApiProperty({
    example: 2500000,
    description: 'Price of the apartment in EGP',
    minimum: 0,
  }) // Added
  @IsNotEmpty({ message: 'Price is required.' })
  price: number;

  @IsNotEmpty({ message: 'Number of bedrooms is required.' })
  @IsNumber({}, { message: 'Bedrooms must be a number.' })
  @Min(0, { message: 'Bedrooms cannot be negative.' })
  @ApiProperty({ example: 3, description: 'Number of bedrooms', minimum: 0 }) // Added
  @IsNotEmpty({ message: 'Number of bedrooms is required.' })
  bedrooms: number;

  @IsNotEmpty({ message: 'Number of bathrooms is required.' })
  @IsNumber({}, { message: 'Bathrooms must be a number.' })
  @Min(1, { message: 'Bathrooms must be at least 1.' })
  @ApiProperty({ example: 2, description: 'Number of bathrooms', minimum: 1 }) // Added
  @IsNotEmpty({ message: 'Number of bathrooms is required.' })
  bathrooms: number;

  @IsNotEmpty({ message: 'Area is required.' })
  @IsNumber({}, { message: 'Area must be a number.' })
  @Min(1, { message: 'Area must be a positive number.' })
  @ApiProperty({
    example: 150,
    description: 'Area of the apartment in square meters',
    minimum: 1,
  }) // Added
  @IsNotEmpty({ message: 'Area is required.' })
  area: number;

  @IsNotEmpty({ message: 'Cover image index is required.' })
  @IsNumber({}, { message: 'Cover image index must be a number.' })
  @ApiProperty({
    example: 0,
    description: 'Index of the cover image in the uploaded images array',
  }) // Added
  @IsNotEmpty({ message: 'Cover image index is required.' })
  coverIndex: number;

  @IsNotEmpty({ message: 'Unit number is required.' })
  @IsString()
  @ApiProperty({
    example: 'A-101',
    description: 'Unit number of the apartment',
  }) // Added
  @IsNotEmpty({ message: 'Unit number is required.' })
  unitNumber: string;

  @IsNotEmpty({ message: 'Project name is required.' })
  @IsString()
  @ApiProperty({
    example: 'Nile Towers',
    description: 'Name of the project or compound',
  }) // Added
  @IsNotEmpty({ message: 'Project name is required.' })
  project: string;

  @IsNotEmpty({ message: 'Developer name is required.' })
  @IsString()
  @ApiProperty({
    example: 'Orascom Development',
    description: 'Name of the developer',
  }) // Added
  @IsNotEmpty({ message: 'Developer name is required.' })
  developer: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationInputDto)
  @ApiPropertyOptional({
    type: () => LocationInputDto,
    description: 'Geographical location of the apartment',
  }) // Added
  @IsOptional()
  location?: LocationInputDto;
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description:
      'Array of images for the apartment (max 10 files, 5MB each, .png, .jpeg, .jpg, .webp)',
  }) // Added
  images: Array<Express.Multer.File>; // This property is handled by FilesInterceptor, added for Swagger documentation
}
