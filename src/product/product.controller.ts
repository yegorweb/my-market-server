import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import ApiError from 'src/exceptions/errors/api-error';
import RequestWithUser from 'src/types/request-with-user.type';
import { ProductService } from './product.service';
import Product from './interfaces/product.interface';
import { ProductClass } from './schemas/product.schema';
import { TryToGetUser } from 'src/auth/try-to-get-user.guard';
import RequestWithUserOrNot from 'src/types/request-with-user-or-not.type';
import { RolesService } from 'src/roles/roles.service';
import { GlobalAdminGuard } from 'src/admin/global_admin.guard';

@Controller('product')
export class ProductController {
  constructor(
    @InjectModel('Product') private ProductModel: Model<ProductClass>,
    private ProductService: ProductService,
    private RolesService: RolesService
  ) {} 

  @UseGuards(TryToGetUser)
  @Get('get')
  async get(
    @Req() req: RequestWithUserOrNot,
  ) {
    let query: any = {
      on_moderation: false,
      moderation_result: true,
    }

    if (req.user) {
      query.author = {
        $ne: new mongoose.Types.ObjectId(req.user._id) 
      }
    }

    return await this.ProductModel.find(query)
  }

  @Get('get-by-id')
  async get_by_id(
    @Query('_id') _id: string, 
  ) {
    return await this.ProductModel.findById(_id)
  }

  @UseGuards(TryToGetUser)
  @Get('get-by-author')
  async get_by_author(
    @Req() req: RequestWithUserOrNot,
    @Query('_id') _id: string, 
  ) {
    return await this.ProductModel.find({
      author: new mongoose.Types.ObjectId(_id),
    })
  }

  @UseGuards(AuthGuard)
  @Get('get-my-products')
  async get_my_products(
    @Req() req: RequestWithUser
  ) {
    return await this.ProductModel.find({
      author: new mongoose.Types.ObjectId(req.user._id)
    })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(
    @Req() req: RequestWithUser, 
    @Body('product') product: Product, 
  ) {
    return await this.ProductModel.create(
      Object.assign(product, { 
        on_moderation: true, 
        moderation_result: null, 
        author: new mongoose.Types.ObjectId(req.user._id), 
        date: Date.now() 
      })
    )
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('response')
  async response(
    @Req() req: RequestWithUser, 
    @Body('product_id') product_id: string, 
  ) {
    let product = await this.ProductModel.findById(product_id)

    if (!product) 
      throw ApiError.BadRequest('Продукт не обнаружена. Возможно, её удалили')

    await product.updateOne({ 
      $push: { 
        responses: new mongoose.Types.ObjectId(req.user._id) 
      } 
    })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('cancel-response')
  async cancel_response(
    @Req() req: RequestWithUser, 
    @Body('product_id') product_id: string, 
  ) {
    let product = await this.ProductModel.findById(product_id)

    if (!product)
      throw ApiError.BadRequest('Продукт не обнаружена. Возможно, её удалили')

    await product.updateOne({ 
      $pull: { 
        responses: new mongoose.Types.ObjectId(req.user._id) 
      } 
    })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('edit')
  async edit(
    @Req() req: RequestWithUser, 
    @Body('product_id') product_id: string, 
    @Body('product') new_product: Product, 
  ) {
    let product = await this.ProductModel.findById(product_id)

    if (!product)
      throw ApiError.BadRequest('Продукт не обнаружена. Возможно, её удалили')
    if (req.user._id !== product.author._id.toString())
      throw ApiError.AccessDenied()

    await product.updateOne(Object.assign(
      new_product, { 
        on_moderation: true, 
        moderation_result: null 
      }
    ), { runValidators: true })

    return { message: 'Отредактировано' }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async delete(
    @Req() req: RequestWithUser, 
    @Query('product_id') product_id: string, 
  ) {
    let product = await this.ProductModel.findById(product_id)

    if (!product)
      throw ApiError.BadRequest('Продукт не обнаружена. Возможно её удалили раньше вас')

    if (!this.RolesService.isGlobalAdmin(req.user.roles) && !this.ProductService.isAuthor(req.user, product))
      throw ApiError.AccessDenied()

    await product.deleteOne()
    return { message: 'Успешно удалено' }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verify(
    @Req() req: RequestWithUser, 
    @Body('product_id') product_id: string, 
    @Body('moderation_result') moderation_result: string | boolean, 
  ) {
    let product = await this.ProductModel.findById(product_id)
    if (!product)
      throw ApiError.BadRequest('Продукт не обнаружена. Возможно, её удалили')

    if (!this.RolesService.isGlobalAdmin(req.user.roles))
      throw ApiError.AccessDenied()
    
    await product.updateOne({ 
      on_moderation: false, 
      moderation_result 
    })
  }

  @UseGuards(GlobalAdminGuard)
  @Get('get-products-to-moderation')
  async get_products_to_moderation(
    @Req() req: RequestWithUser, 
  ) {
    return await this.ProductModel.find({ 
      on_moderation: true, 
    })
  }
}

