import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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
import { s3 } from '../s3/bucket';

@Controller('product')
export class ProductController {
  constructor(
    @InjectModel('Product') private ProductModel: Model<ProductClass>,
    private ProductService: ProductService,
  ) { }

  @UseGuards(TryToGetUser)
  @Get('get')
  async get(
    @Req() req: RequestWithUserOrNot,
  ) {
    let query: any = {}

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
        author: new mongoose.Types.ObjectId(req.user._id),
      })
    )
  }

  @Post('upload-images')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('_id') productId: String,
  ) {
    let filenames = []
    let buffers = []
    console.log(files);
    
    for (let file of files) {
      buffers.push({ buffer: file.buffer, name: file.originalname, });    // Буфер загруженного файла
    }
    console.log(buffers);
    
    if (buffers.length) {
      let uploadResult = await s3.Upload(buffers, '/iwat/');
      console.log(uploadResult);
      
      for (let upl of uploadResult) {
        filenames.push(upl.Location)
      }
    }
    console.log(filenames);
    
    return await this.ProductModel.findByIdAndUpdate(productId, { $set: { images: filenames } })
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
      throw ApiError.BadRequest('Продукт не обнаружен. Возможно, его удалили')

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
  @Delete('delete')
  async delete(
    @Req() req: RequestWithUser,
    @Query('product_id') product_id: string,
  ) {
    let product = await this.ProductModel.findById(product_id)

    if (!product)
      throw ApiError.BadRequest('Продукт не обнаружена. Возможно её удалили раньше вас')

    if (!this.ProductService.isAuthor(req.user, product))
      throw ApiError.AccessDenied()

    await product.deleteOne()
    return { message: 'Успешно удалено' }
  }

  // @UseGuards(AuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @Post('edit')
  // async edit(
  //   @Req() req: RequestWithUser, 
  //   @Body('product_id') product_id: string, 
  //   @Body('product') new_product: Product, 
  // ) {
  //   let product = await this.ProductModel.findById(product_id)

  //   if (!product)
  //     throw ApiError.BadRequest('Продукт не обнаружена. Возможно, её удалили')
  //   if (req.user._id !== product.author._id.toString())
  //     throw ApiError.AccessDenied()

  //   await product.updateOne(Object.assign(
  //     new_product, { 
  //       on_moderation: true, 
  //       moderation_result: null 
  //     }
  //   ), { runValidators: true })

  //   return { message: 'Отредактировано' }
  // }
}

