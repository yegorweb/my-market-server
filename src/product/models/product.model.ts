import { MongooseModule } from "@nestjs/mongoose"
import { ProductSchema } from "../schemas/product.schema"

let ProductModel = MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema, collection: 'products' }])
export default ProductModel