import * as slugUpdater from 'mongoose-slug-updater';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

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
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type IApartmentDocument = Document & IApartment;

@Schema({ timestamps: true })
export class Apartment
  extends Document
  implements Omit<IApartment, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ required: true, min: 3, max: 255, trim: true })
  name: string;

  @Prop({ required: true, unique: true, slug: ['project', 'name'] })
  slug: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  bedrooms: number;

  @Prop({ required: true, type: Number })
  bathrooms: number;

  @Prop({ required: true, type: Number })
  area: number;

  @Prop({ required: true, type: Number })
  unitNumber: number;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  project: string; // In a more complex setting this should be a reference to a Project document

  @Prop([String])
  images: string[];
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
ApartmentSchema.plugin(slugUpdater);
