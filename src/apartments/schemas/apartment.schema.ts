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
  unitNumber: number;
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
  @Prop({ index: true, slug: ['developer', 'project', 'unitNumber'] })
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
  unitNumber: number;
  @Prop({ required: true, lowercase: true })
  project: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true, lowercase: true })
  developer: string;

  @Prop({ required: true })
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
ApartmentSchema.index({ name: 'text' });
ApartmentSchema.index({ project: 'text' });
ApartmentSchema.index({ developer: 'text' });
ApartmentSchema.index({ price: 1 });
