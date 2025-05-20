import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // Added

export class ListingLocationDto {
  @ApiProperty({
    example: [30.0444, 31.2357],
    description: 'Coordinates of the location [latitude, longitude]',
  }) // Added
  @Expose()
  coordinates: [number, number];
}

export class ApartmentListingDto {
  @ApiProperty({
    example: '60d5f9f3f8a8c0a0e8b0b5a2',
    description: 'The unique identifier of the apartment',
  }) // Added
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'Modern Apartment in Downtown',
    description: 'Name of the apartment',
  }) // Added
  @Expose()
  name: string;

  @ApiProperty({
    example: 'modern-apartment-in-downtown',
    description: 'URL-friendly slug for the apartment',
  }) // Added
  @Expose()
  slug: string;

  @ApiProperty({ example: 1500000, description: 'Price of the apartment' }) // Added
  @Expose()
  price: number;

  @ApiProperty({ example: 3, description: 'Number of bedrooms' }) // Added
  @Expose()
  bedrooms: number;

  @ApiProperty({ example: 2, description: 'Number of bathrooms' }) // Added
  @Expose()
  bathrooms: number;

  @ApiProperty({
    example: 120,
    description: 'Area of the apartment in square meters',
  }) // Added
  @Expose()
  area: number;

  @ApiProperty({
    example: 'Skyline Towers',
    description: 'Name of the project',
  }) // Added
  @Expose()
  project: string;

  @ApiProperty({ example: 'Emaar', description: 'Name of the developer' }) // Added
  @Expose()
  developer: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: 'URL of the cover image',
  }) // Added
  @Expose()
  coverImage: string;

  @ApiProperty({
    example: '123 Main St, Downtown, Cairo',
    description: 'Address of the apartment',
  }) // Added
  @Expose()
  address: string;
}
