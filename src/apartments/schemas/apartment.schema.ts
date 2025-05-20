import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface IApartment {
  _id: Types.ObjectId;
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
  location: GeoJsonPoint;
  developer: string;
  coverImage: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IApartmentPublic extends Omit<IApartment, '_id'> {
  _id: string;
}

export type IApartmentDocument = Document & IApartment;

@Schema({ timestamps: true })
export class Apartment extends Document {
  @Prop({ required: true, index: true, lowercase: true })
  name: string;
  @Prop({
    index: true,
    slug: ['developer', 'project', 'unitNumber'],
    unique: true,
  })
  slug: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true, lowercase: true })
  address: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  bedrooms: number;
  @Prop({ required: true })
  bathrooms: number;
  @Prop({ required: true })
  area: number;
  @Prop({ required: true })
  unitNumber: string;
  @Prop({ required: true, lowercase: true })
  project: string;

  @Prop({ required: true, default: [] })
  images: string[];

  @Prop({ required: true, lowercase: true })
  developer: string;

  @Prop({ required: true, default: '/placeholder.svg' })
  coverImage: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: GeoJsonPoint;
}
export const ApartmentSchema = SchemaFactory.createForClass(Apartment);

ApartmentSchema.index({ location: '2dsphere' });
ApartmentSchema.index({ price: 1 });
ApartmentSchema.index(
  {
    name: 'text',
    unitNumber: 'text',
    project: 'text',
    developer: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 10,
      unitNumber: 8,
      project: 5,
      developer: 3,
      description: 1,
    },
    name: 'ApartmentTextSearchIndex',
  },
);
