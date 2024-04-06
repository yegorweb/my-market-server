import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import ProductModel from './models/product.model';

@Module({
  imports: [
    ProductModel,
    TokenModule,
    JwtModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
