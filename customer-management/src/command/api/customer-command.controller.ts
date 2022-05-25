import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Customer } from 'src/query/customer.entity'
import { CustomerCreateDto } from './customer-create.dto'
import { CustomerEvent } from '../db/customer-event.entity'
import { CustomerEventService } from '../db/customer-event.service'
import * as crypto from "node:crypto"
import { constructFromObjects, validationOptions } from 'src/app.constants'
import { validate } from 'class-validator'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

@ApiTags("customer command")
@Controller({
    path: "customers",
    version: "1"
})
export class CustomerCommandController {
    constructor(
        private readonly customerEventService: CustomerEventService,
        private readonly amqpConnection: AmqpConnection
    ) {}

    /**
     * Get all events linked to a customer. For debugging purposes only.
     */
    @Get("events/:customerId")
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse({ type: [CustomerEvent] })
    async getEventsForCustomer(
        @Param("customerId", new ParseUUIDPipe()) customerId: string
    ): Promise<CustomerEvent[]> {
        return this.customerEventService.findEventsForCustomer(customerId)
    }

    @Post()
    @ApiCreatedResponse({ type: Customer })
    @ApiBadRequestResponse()
    async createCustomer(
        @Body(new ValidationPipe(validationOptions)) customerCreateDto: CustomerCreateDto
    ): Promise<Customer> {
        const event = new CustomerEvent()
        event.event.eventName = "CustomerCreated"
        Object.assign(event, customerCreateDto)
        event.customerId = crypto.randomUUID()

        const createdEvent = await this.customerEventService.insert(event)
        event.event = createdEvent.event
        await this.amqpConnection.publish("ball", "", event)

        return constructFromObjects(Customer, customerCreateDto, event)
    }

    @Put(":customerId")
    @ApiOkResponse({ type: CustomerCreateDto })
    @ApiBadRequestResponse()
    async updateCustomer(
        @Param("customerId", new ParseUUIDPipe()) customerId: string,
        @Body(new ValidationPipe(validationOptions)) customerUpdateDto: CustomerCreateDto
    ): Promise<CustomerCreateDto> {
        const event = new CustomerEvent()
        event.event.eventName = "CustomerUpdated"
        Object.assign(event, customerUpdateDto, { customerId })

        const createdEvent = await this.customerEventService.insert(event)

        this.removeNullsFromDatabase(createdEvent)

        await this.amqpConnection.publish("ball", "", createdEvent)

        return customerUpdateDto
    }

    @Delete(":customerId")
    @HttpCode(204)
    @ApiNoContentResponse()
    @ApiBadRequestResponse()
    async deleteCustomer(
        @Param("customerId", new ParseUUIDPipe()) customerId: string
    ): Promise<void> {
        const event = new CustomerEvent()
        event.event.eventName = "CustomerDeleted"
        event.customerId = customerId
        event.isActive = false

        const createdEvent = await this.customerEventService.insert(event)

        this.removeNullsFromDatabase(createdEvent)

        await this.amqpConnection.publish("ball", "", createdEvent)
    }

    private removeNullsFromDatabase(objectFromDatabase: { [key: string]: any }) {
        for (const key in objectFromDatabase) {
            objectFromDatabase[key] ??= undefined
        }
    }
}
