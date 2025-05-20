export type { ApartmentListingDto } from '@apartments/dto/apartment-listing.dto';
export type { GetApartmentsFilterDto } from '@apartments/dto/get-apartments-filter.dto';
export type { IApartmentPublic } from '@apartments/schemas/apartment.schema';
export type { IErrorResponse } from '@common/filters/global-exception.filter';
export interface IGetAllReponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
