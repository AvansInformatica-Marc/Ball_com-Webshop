import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Supplier } from 'src/query/supplier.entity'
import { SupplierCreateDto } from './supplier-create.dto'
import { SupplierEvent } from './supplier-event.entity'
import { SupplierEventService } from './supplier-event.service'
import * as crypto from "node:crypto"

@ApiTags("supplier command")
@Controller({
    path: "suppliers",
    version: "1"
})
export class SupplierCommandController {
    constructor(
        private readonly supplierEventService: SupplierEventService,
        @Inject("SUPPLIER_SERVICE") private mqClient: ClientProxy,
    ) {}

    /**
     * Get all events linked to a supplier. For debugging purposes only.
     */
    @Get("events/:id")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [SupplierEvent] })
    async getEventsForSupplier(@Param("id", new ParseUUIDPipe()) id: string): Promise<SupplierEvent[]> {
        return this.supplierEventService.findEventsForSupplier(id)
    }

    @Post()
    @ApiCreatedResponse({ type: Supplier })
    @ApiBadRequestResponse()
    async createSupplier(@Body(new ValidationPipe()) supplierCreateDto: SupplierCreateDto): Promise<Supplier> {
        const event = new SupplierEvent()
        event.eventName = "SupplierCreated"
        event.name = supplierCreateDto.name
        event.supplierId = crypto.randomUUID()
        const createdEvent = await this.supplierEventService.insert(event)

        this.mqClient.emit(createdEvent.eventName, createdEvent)

        const supplier = new Supplier()
        supplier.name = createdEvent.name
        supplier.id = createdEvent.supplierId
        supplier.isActive = createdEvent.isActive
        return supplier
    }
}
