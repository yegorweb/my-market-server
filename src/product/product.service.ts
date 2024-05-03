import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';
import { User } from 'src/user/interfaces/user.interface';
import ProductFromClient from './interfaces/product-from-client.interface';
import Product from './interfaces/product.interface';
import { ProductClass } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private ProductModel: Model<ProductClass>,
  ) {}

  isAuthor(user: { _id: string | mongoose.Types.ObjectId }, document: { author: { _id: string | mongoose.Types.ObjectId } }): boolean {
    return user._id == document.author._id
  }
}
