import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CustomerEvent } from './command/db/customer-event.entity'
import { CustomerEventService } from './command/db/customer-event.service'

@ApiTags("customer event store")
@Controller({
    path: "customers",
    version: "1"
})
export class EventStoreController {
    constructor(
        private readonly customerEventService: CustomerEventService
    ) {}

    /**
     * Get all events linked to a customer. For debugging purposes only.
     */
    @Get(":customerId/events")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [CustomerEvent] })
    async getEventsForCustomer(
        @Param("customerId", new ParseUUIDPipe()) customerId: string
    ): Promise<CustomerEvent[]> {
        return this.customerEventService.findEventsForCustomer(customerId)
    }
}
