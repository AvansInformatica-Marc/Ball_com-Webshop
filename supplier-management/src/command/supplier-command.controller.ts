import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Supplier } from 'src/query/supplier.entity'
import { SupplierCreateDto } from './supplier-create.dto'
import { SupplierEvent } from './supplier-event.entity'
import { SupplierEventService } from './supplier-event.service'
import * as crypto from "node:crypto"
import { validationOptions } from 'src/app.constants'
import { validate } from 'class-validator'

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
    @Get("events/:supplierId")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [SupplierEvent] })
    async getEventsForSupplier(
        @Param("supplierId", new ParseUUIDPipe()) id: string
    ): Promise<SupplierEvent[]> {
        return this.supplierEventService.findEventsForSupplier(id)
    }

    @Post()
    @ApiCreatedResponse({ type: Supplier })
    @ApiBadRequestResponse()
    async createSupplier(
        @Body(new ValidationPipe(validationOptions)) supplierCreateDto: SupplierCreateDto
    ): Promise<Supplier> {
        const event = new SupplierEvent()
        event.eventName = "SupplierCreated"
        Object.assign(event, supplierCreateDto)
        event.supplierId = crypto.randomUUID()

        const createdEvent = await this.supplierEventService.insert(event)
        this.mqClient.emit(createdEvent.eventName, createdEvent)

        const supplier = new Supplier()
        Object.assign(supplier, supplierCreateDto, createdEvent)
        validate(supplier, validationOptions)
        return supplier
    }

    @Put(":supplierId")
    @ApiOkResponse({ type: Supplier })
    @ApiBadRequestResponse()
    async updateSupplier(
        @Param("supplierId", new ParseUUIDPipe()) supplierId: string,
        @Body(new ValidationPipe(validationOptions)) supplierUpdateDto: SupplierCreateDto
    ): Promise<Supplier> {
        const event = new SupplierEvent()
        event.eventName = "SupplierUpdated"
        Object.assign(event, supplierUpdateDto, { supplierId })

        const createdEvent = await this.supplierEventService.insert(event)
        this.mqClient.emit(createdEvent.eventName, createdEvent)

        const supplier = new Supplier()
        Object.assign(supplier, supplierUpdateDto, createdEvent)
        validate(supplier, validationOptions)
        return supplier
    }

    @Delete(":supplierId")
    @HttpCode(204)
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    async deleteSupplier(
        @Param("supplierId", new ParseUUIDPipe()) supplierId: string
    ): Promise<void> {
        const event = new SupplierEvent()
        event.eventName = "SupplierDeleted"
        event.supplierId = supplierId
        event.isActive = false

        const createdEvent = await this.supplierEventService.insert(event)

        createdEvent.name ??= undefined
        createdEvent.address ??= undefined
        createdEvent.city ??= undefined

        this.mqClient.emit(createdEvent.eventName, createdEvent)
    }
}
