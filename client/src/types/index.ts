export interface IListing {
  _id: string;
  name: string;
  slug: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  project: string;
  developer: string;
  coverImage: string;
  address: string;
}
export interface IApartment {
  _id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  unitNumber: string;
  project: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  developer: string;
  coverImage: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line
export interface IGetAllReponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
