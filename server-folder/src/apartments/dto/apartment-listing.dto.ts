import { Expose } from 'class-transformer';

export class ListingLocationDto {
  @Expose()
  coordinates: [number, number];
}

export class ApartmentListingDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  price: number;

  @Expose()
  bedrooms: number;

  @Expose()
  bathrooms: number;

  @Expose()
  area: number;

  @Expose()
  project: string;

  @Expose()
  developer: string;

  @Expose()
  coverImage: string;

  @Expose()
  address: string;
}
