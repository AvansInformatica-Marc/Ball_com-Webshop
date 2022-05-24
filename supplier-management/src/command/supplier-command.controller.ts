import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Put, ValidationPipe } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Supplier } from 'src/query/supplier.entity'
import { SupplierCreateDto } from './supplier-create.dto'
import { SupplierEvent } from './supplier-event.entity'
import { SupplierEventService } from './supplier-event.service'
import * as crypto from "node:crypto"
import { SupplierUpdateDto } from './supplier-update.dto'
import { create } from 'node:domain'

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
        supplier.name = supplierCreateDto.name
        supplier.id = createdEvent.supplierId
        supplier.isActive = createdEvent.isActive
        return supplier
    }

    @Put(":id")
    @ApiOkResponse({ type: Supplier })
    @ApiBadRequestResponse()
    async updateSupplier(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body(new ValidationPipe()) supplierUpdateDto: SupplierCreateDto
    ): Promise<Supplier> {
        const event = new SupplierEvent()
        event.eventName = "SupplierUpdated"
        event.name = supplierUpdateDto.name ?? null
        event.supplierId = id
        const createdEvent = await this.supplierEventService.insert(event)

        this.mqClient.emit(createdEvent.eventName, createdEvent)

        const supplier = new Supplier()
        supplier.name = supplierUpdateDto.name
        supplier.id = createdEvent.supplierId
        supplier.isActive = createdEvent.isActive
        return supplier
    }

    @Patch(":id")
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async patchSupplier(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body(new ValidationPipe()) supplierUpdateDto: SupplierUpdateDto
    ): Promise<void> {
        const event = new SupplierEvent()
        event.eventName = "SupplierUpdated"
        event.name = supplierUpdateDto.name
        event.supplierId = id
        const createdEvent = await this.supplierEventService.insert(event)
        createdEvent.name ??= undefined

        this.mqClient.emit(createdEvent.eventName, createdEvent)
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    async deleteSupplier(
        @Param("id", new ParseUUIDPipe()) id: string
    ): Promise<void> {
        const event = new SupplierEvent()
        event.eventName = "SupplierDeleted"
        event.supplierId = id
        event.isActive = false
        const createdEvent = await this.supplierEventService.insert(event)
        createdEvent.name ??= undefined

        this.mqClient.emit(createdEvent.eventName, createdEvent)
    }
}
