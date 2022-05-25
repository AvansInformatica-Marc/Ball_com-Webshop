import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { MQ_EXCHANGE, MQ_ROUTING_KEY, constructFromObjects, validationOptions } from "./app.constants";
import { Event } from "./command/db/event.entity";
import { SupplierEvent } from "./command/db/supplier-event.entity";
import { Supplier } from "./query/supplier.entity";
import { SupplierService } from "./query/supplier.service";

@Injectable()
export class MqService {
    constructor(
        private readonly supplierService: SupplierService
    ) {}

    @RabbitSubscribe({
        exchange: MQ_EXCHANGE,
        routingKey: MQ_ROUTING_KEY,
        queue: 'supplier',
    })
    async onMessage(message: { event: Event, [key: string]: any }) {
        switch (message.event.eventName) {
            case "SupplierCreated": {
                await this.onSupplierCreated(this.createSupplierEventFromMessage(message))
                break
            }
            case "SupplierUpdated": {
                await this.onSupplierUpdated(this.createSupplierEventFromMessage(message))
                break
            }
            case "SupplierDeleted": {
                await this.onSupplierRemoved(this.createSupplierEventFromMessage(message))
                break
            }
        }
    }

    private createSupplierEventFromMessage(message: { [key: string]: any }): SupplierEvent {
        return constructFromObjects(SupplierEvent, message)
    }

    async onSupplierCreated(supplierEvent: SupplierEvent) {
        const supplier = constructFromObjects(Supplier, supplierEvent)
        await this.supplierService.create(supplier)
    }

    async onSupplierUpdated(supplierEvent: SupplierEvent) {
        const supplier = constructFromObjects(Supplier, supplierEvent)
        await this.supplierService.update(supplierEvent.supplierId, supplier)
    }

    async onSupplierRemoved(supplierEvent: SupplierEvent) {
        await this.supplierService.update(supplierEvent.supplierId, { isActive: false })
    }
}
