import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductClass } from 'src/product/schemas/product.schema';
import ApiError from 'src/exceptions/errors/api-error';
import RequestWithUser from 'src/types/request-with-user.type';
import { UserClass } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Product') private ProductModel: Model<ProductClass>,
    private UserService: UserService,
  ) {} 

  @Get('get-by-id')
  async get_by_id(
    @Query('_id') _id: string, 
  ) {
    let candidate = await this.UserModel.findById(_id, { password: 0 })
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким ID не найден')

    return candidate
  }

  @UseGuards(AuthGuard)
  @Get('get-my-responses')
  async get_my_responses(
    @Req() req: RequestWithUser, 
  ) {
    return await this.ProductModel.find({ 
      responses: new mongoose.Types.ObjectId(req.user._id) 
    })
  }
}
