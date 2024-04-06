import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import ProductModel from 'src/product/models/product.model';
import UserModel from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UserModel,
    ProductModel,
    JwtModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
