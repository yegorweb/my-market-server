import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';

export type ProductDocument = HydratedDocument<ProductClass>

@Schema()
export class ProductClass {
  @Prop()
  title: string

  @Prop()
  description: string

  @Prop({ 
    type: mongoose.SchemaTypes.ObjectId, 
    ref: 'User',
    autopopulate: true
  })
  author: User

  @Prop()
  address: string

  @Prop()
  price: string

  @Prop()
  phone: string

  @Prop(raw({
    type: {
      type: String
    },
    coordinates: [Number]
  }))
  location: Record<string, any>

  @Prop()
  images: string[]
}

export const ProductSchema = SchemaFactory.createForClass(ProductClass)
