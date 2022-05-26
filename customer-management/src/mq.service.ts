import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { MQ_EXCHANGE, MQ_ROUTING_KEY, constructFromObjects, validationOptions } from "./app.constants";
import { Event } from "./command/db/event.entity";
import { CustomerEvent } from "./command/db/customer-event.entity";
import { Customer } from "./query/customer.entity";
import { CustomerService } from "./query/customer.service";

@Injectable()
export class MqService {
    constructor(
        private readonly customerService: CustomerService
    ) {}

    @RabbitSubscribe({
        exchange: MQ_EXCHANGE,
        routingKey: MQ_ROUTING_KEY,
        queue: 'customer',
    })
    async onMessage(message: { event: Event, [key: string]: any }) {
        switch (message.event.eventName) {
            case "CustomerCreated": {
                await this.onCustomerCreated(this.createCustomerEventFromMessage(message))
                break
            }
            case "CustomerUpdated": {
                await this.onCustomerUpdated(this.createCustomerEventFromMessage(message))
                break
            }
            case "CustomerDeleted": {
                await this.onCustomerRemoved(this.createCustomerEventFromMessage(message))
                break
            }
        }
    }

    private createCustomerEventFromMessage(message: { [key: string]: any }): CustomerEvent {
        return constructFromObjects(CustomerEvent, message)
    }

    async onCustomerCreated(customerEvent: CustomerEvent) {
        const customer = constructFromObjects(Customer, customerEvent)
        await this.customerService.create(customer)
    }

    async onCustomerUpdated(customerEvent: CustomerEvent) {
        const customer = constructFromObjects(Customer, customerEvent)
        await this.customerService.update(customerEvent.customerId, customer)
    }

    async onCustomerRemoved(customerEvent: CustomerEvent) {
        await this.customerService.update(customerEvent.customerId, { isActive: false })
    }
}
