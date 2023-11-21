import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserClass>

@Schema()
export class UserClass {
  @Prop({ 
    type: String, 
    required: true,
    min: 2
  })
  name: string

  @Prop({ 
    type: String, 
    required: true,
    validators: {
      validate: function(value: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
      }
    }
  })
  email: string

  @Prop({ 
    type: String, 
    required: true,
  })
  password: string

  @Prop()
  avatar_url?: string

  @Prop({ 
    type: Number, 
    required: true 
  })
  date: number

  @Prop({
    type: [String], 
    default: [],
    required: true
  })
  roles: string[]
}

export const UserSchema = SchemaFactory.createForClass(UserClass)
