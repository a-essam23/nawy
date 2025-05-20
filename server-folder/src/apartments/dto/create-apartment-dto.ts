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

class LocationInputDto {
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}

export class CreateApartmentDto {
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
  address: string;

  @IsNotEmpty({ message: 'Price is required.' })
  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  price: number;

  @IsNotEmpty({ message: 'Number of bedrooms is required.' })
  @IsNumber({}, { message: 'Bedrooms must be a number.' })
  @Min(0, { message: 'Bedrooms cannot be negative.' })
  bedrooms: number;

  @IsNotEmpty({ message: 'Number of bathrooms is required.' })
  @IsNumber({}, { message: 'Bathrooms must be a number.' })
  @Min(1, { message: 'Bathrooms must be at least 1.' })
  bathrooms: number;

  @IsNotEmpty({ message: 'Area is required.' })
  @IsNumber({}, { message: 'Area must be a number.' })
  @Min(1, { message: 'Area must be a positive number.' })
  area: number;

  @IsNotEmpty({ message: 'Cover image index is required.' })
  @IsNumber({}, { message: 'Cover image index must be a number.' })
  coverIndex: number;

  @IsNotEmpty({ message: 'Unit number is required.' })
  @IsString()
  unitNumber: string;

  @IsNotEmpty({ message: 'Project name is required.' })
  @IsString()
  project: string;

  @IsNotEmpty({ message: 'Developer name is required.' })
  @IsString()
  developer: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationInputDto)
  location?: LocationInputDto;
}
