import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';

export type ProductDocument = HydratedDocument<ProductClass>

@Schema()
export class ProductClass {
  @Prop({ 
    required: true,
    min: 4,
    max: 32
  })
  title: string

  @Prop({ 
    required: true, 
    min: 20,
    max: 150 
  })
  description: string

  @Prop({ 
    type: mongoose.SchemaTypes.ObjectId, 
    ref: 'User',
    required: true,
    autopopulate: true
  })
  author: User

  @Prop([{ 
    type: mongoose.SchemaTypes.ObjectId, 
    ref: 'User',
  }])
  responses: mongoose.Types.ObjectId[]

  @Prop({ 
    required: true
  })
  address: string

  @Prop(raw({
    type: {
      type: String
    },
    coordinates: [Number]
  }))
  location: Record<string, any>
}

export const ProductSchema = SchemaFactory.createForClass(ProductClass)
