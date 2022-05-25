import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ProductEventService } from './command/db/product-event.service'
import { ProductEvent } from './command/db/product-event.entity'

@ApiTags("product event store")
@Controller({
    path: "products",
    version: "1"
})
export class EventStoreController {
    constructor(
        private readonly productEventService: ProductEventService
    ) {}

    /**
     * Get all events linked to a product. For debugging purposes only.
     */
    @Get(":productId/events")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [ProductEvent] })
    async getEventsForProduct(
        @Param("productId", new ParseUUIDPipe()) productId: string
    ): Promise<ProductEvent[]> {
        return this.productEventService.findEventsForProduct(productId)
    }
}
