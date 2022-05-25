import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ProductCreateDto } from './product-create.dto'
import { ProductEventService } from '../db/product-event.service'
import * as crypto from "node:crypto"
import { constructFromObjects, validationOptions } from 'src/app.constants'
import { ProductEvent } from '../db/product-event.entity'
import { Product } from 'src/query/product.entity'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

@ApiTags("product command")
@Controller({
    path: "products",
    version: "1"
})
export class ProductCommandController {
    constructor(
        private readonly productEventService: ProductEventService,
        private readonly amqpConnection: AmqpConnection
    ) {}

    /**
     * Get all events linked to a product. For debugging purposes only.
     */
    @Get("events/:productId")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [ProductEvent] })
    async getEventsForProduct(
        @Param("productId", new ParseUUIDPipe()) productId: string
    ): Promise<ProductEvent[]> {
        return this.productEventService.findEventsForProduct(productId)
    }

    @Post()
    @ApiCreatedResponse({ type: Product })
    @ApiBadRequestResponse()
    async createProduct(
        @Body(new ValidationPipe(validationOptions)) productCreateDto: ProductCreateDto
    ): Promise<Product> {
        const event = new ProductEvent()
        event.event.eventName = "ProductCreated"
        Object.assign(event, productCreateDto)
        event.productId = crypto.randomUUID()

        const createdEvent = await this.productEventService.insert(event)
        await this.amqpConnection.publish("ball", "", createdEvent)

        return constructFromObjects(Product, productCreateDto, createdEvent)
    }

    @Put(":productId")
    @ApiOkResponse({ type: ProductCreateDto })
    @ApiBadRequestResponse()
    async updateProduct(
        @Param("productId", new ParseUUIDPipe()) productId: string,
        @Body(new ValidationPipe(validationOptions)) productUpdateDto: ProductCreateDto
    ): Promise<ProductCreateDto> {
        const event = new ProductEvent()
        event.event.eventName = "ProductUpdated"
        Object.assign(event, productUpdateDto, { productId })

        const createdEvent = await this.productEventService.insert(event)
        await this.amqpConnection.publish("ball", "", createdEvent)

        return productUpdateDto
    }

    @Delete(":productId")
    @HttpCode(204)
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    async deleteProduct(
        @Param("productId", new ParseUUIDPipe()) productId: string
    ): Promise<void> {
        const event = new ProductEvent()
        event.event.eventName = "ProductDeleted"
        event.productId = productId
        event.stock = 0

        const createdEvent = await this.productEventService.insert(event)

        this.removeNullsFromDatabase(createdEvent)

        await this.amqpConnection.publish("ball", "", createdEvent)
    }

    private removeNullsFromDatabase(objectFromDatabase: { [key: string]: any }) {
        for (const key in objectFromDatabase) {
            if (objectFromDatabase[key] == null) {
                objectFromDatabase[key] = undefined
            }
        }
    }
}
