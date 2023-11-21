import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';
import { User } from 'src/user/interfaces/user.interface';
import ProductFromClient from './interfaces/product-from-client.interface';
import Product from './interfaces/product.interface';
import { ProductClass } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private ProductModel: Model<ProductClass>,
    private RolesService: RolesService
  ) {}

  isAuthor(user: User | UserFromClient, document: Product | ProductFromClient): boolean {
    return user._id == document.author._id
  }
}
