import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Supplier } from 'src/query/supplier.entity'
import { SupplierCreateDto } from './supplier-create.dto'
import { SupplierEvent } from '../supplier-event.entity'
import { SupplierEventService } from '../db/supplier-event.service'
import * as crypto from "node:crypto"
import { validationOptions } from 'src/app.constants'
import { validate } from 'class-validator'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

@ApiTags("supplier command")
@Controller({
    path: "suppliers",
    version: "1"
})
export class SupplierCommandController {
    constructor(
        private readonly supplierEventService: SupplierEventService,
        private readonly amqpConnection: AmqpConnection
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
        event.event.eventName = "SupplierCreated"
        Object.assign(event, supplierCreateDto)
        event.supplierId = crypto.randomUUID()

        const createdEvent = await this.supplierEventService.insert(event)
        event.event = createdEvent.event
        await this.amqpConnection.publish("ball", "", event)

        const supplier = new Supplier()
        Object.assign(supplier, supplierCreateDto, event)
        validate(supplier, validationOptions)
        return supplier
    }

    @Put(":supplierId")
    @ApiOkResponse({ type: SupplierCreateDto })
    @ApiBadRequestResponse()
    async updateSupplier(
        @Param("supplierId", new ParseUUIDPipe()) supplierId: string,
        @Body(new ValidationPipe(validationOptions)) supplierUpdateDto: SupplierCreateDto
    ): Promise<SupplierCreateDto> {
        const event = new SupplierEvent()
        event.event.eventName = "SupplierUpdated"
        Object.assign(event, supplierUpdateDto, { supplierId })

        const createdEvent = await this.supplierEventService.insert(event)
        await this.amqpConnection.publish("ball", "", createdEvent)

        return supplierUpdateDto
    }

    @Delete(":supplierId")
    @HttpCode(204)
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    async deleteSupplier(
        @Param("supplierId", new ParseUUIDPipe()) supplierId: string
    ): Promise<void> {
        const event = new SupplierEvent()
        event.event.eventName = "SupplierDeleted"
        event.supplierId = supplierId
        event.isActive = false

        const createdEvent = await this.supplierEventService.insert(event)

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
