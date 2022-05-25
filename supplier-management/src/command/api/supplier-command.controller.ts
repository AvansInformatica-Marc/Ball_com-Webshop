import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Supplier } from 'src/query/supplier.entity'
import { SupplierCreateDto } from './supplier-create.dto'
import { SupplierEvent } from '../db/supplier-event.entity'
import { SupplierEventService } from '../db/supplier-event.service'
import * as crypto from "node:crypto"
import { constructFromObjects, validationOptions } from 'src/app.constants'
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

        return constructFromObjects(Supplier, supplierCreateDto, event)
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
            objectFromDatabase[key] ??= undefined
        }
    }
}
