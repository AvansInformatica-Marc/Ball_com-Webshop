import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SupplierEvent } from './command/db/supplier-event.entity'
import { SupplierEventService } from './command/db/supplier-event.service'

@ApiTags("supplier event store")
@Controller({
    path: "suppliers",
    version: "1"
})
export class EventStoreController {
    constructor(
        private readonly supplierEventService: SupplierEventService
    ) {}

    /**
     * Get all events linked to a supplier. For debugging purposes only.
     */
    @Get(":supplierId/events")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [SupplierEvent] })
    async getEventsForSupplier(
        @Param("supplierId", new ParseUUIDPipe()) supplierId: string
    ): Promise<SupplierEvent[]> {
        return this.supplierEventService.findEventsForSupplier(supplierId)
    }
}
