import { Controller, Get, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Product } from './product.entity'
import { ProductService } from './product.service'

@ApiTags("product query")
@Controller({
    path: "products",
    version: "1"
})
export class ProductQueryController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @ApiOkResponse({ type: [Product] })
    getAllProducts(): Promise<Product[]> {
        return this.productService.findAll()
    }

    @Get(":productId")
    @ApiNotFoundResponse()
    @ApiOkResponse({ type: Product })
    @ApiBadRequestResponse()
    async getProductById(
        @Param("productId", new ParseUUIDPipe()) productId: string
    ): Promise<Product> {
        const product = await this.productService.findOne(productId)

        if (product == undefined) {
            throw new NotFoundException()
        }

        return product
    }
}
