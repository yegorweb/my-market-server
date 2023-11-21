import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';

export type ProductDocument = HydratedDocument<ProductClass>

@Schema()
export class ProductClass {
  @Prop({ 
    type: String, 
    required: true,
    min: 4,
    max: 32
  })
  title: string

  @Prop({ 
    type: String, 
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
    type: Number,
    required: true,
  })
  date: number

  @Prop({ 
    type: Boolean,
    required: true
  })
  on_moderation: boolean

  @Prop()
  moderation_result: boolean
}

export const ProductSchema = SchemaFactory.createForClass(ProductClass)
